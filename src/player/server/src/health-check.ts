import { GetBucketLocationCommand } from "@aws-sdk/client-s3";
import { convertFirstRowToCamelCase, query } from "@oly_op/pg-helpers";
import { FastifyPluginAsync, RouteGenericInterface } from "fastify";
import { Redis } from "ioredis";
import { Pool } from "pg";
import { pipe } from "rxjs";

import { agIndex, s3 } from "./services.js";

type Status = "OK" | "FAILED";

interface HealthCheck {
	request: Status;
	timestamp: number;
	uptime: string;
	postgres: Status;
	s3: Status;
	algolia: Status;
}

interface Route extends RouteGenericInterface {
	Reply: HealthCheck;
}

const checkDatabase = async (pool: Pool): Promise<Status> => {
	try {
		await query(pool)("SELECT NOW()")({
			parse: pipe(convertFirstRowToCamelCase<{ now: string }>(), row => row.now),
		});
	} catch {
		return "FAILED";
	}

	return "OK";
};

const checkS3 = async (): Promise<Status> => {
	try {
		const command = new GetBucketLocationCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME });
		const output = await s3.send(command);
		const location = output.LocationConstraint;

		if (!location) {
			return "FAILED";
		}
	} catch {
		return "FAILED";
	}

	return "OK";
};

const checkAlgolia = async (): Promise<Status> => {
	try {
		const settings = await agIndex.getSettings();

		if (!settings) {
			return "FAILED";
		}
	} catch {
		return "FAILED";
	}

	return "OK";
};

const checkRedis = async (redis: Redis): Promise<Status> => {
	try {
		const pong = await redis.ping();

		if (pong !== "PONG") {
			return "FAILED";
		}
	} catch {
		return "FAILED";
	}

	return "OK";
};

const uptimeFormatter = new Intl.RelativeTimeFormat(undefined, {
	style: "long",
	numeric: "always",
});

// eslint-disable-next-line @typescript-eslint/require-await
export const healthCheck: FastifyPluginAsync = async fastify => {
	fastify.get<Route>("/health-check", async (request, reply) => {
		let status = false;

		const [isS3, isAlgolia, isRedis, isPostgres] = await Promise.all([
			await checkS3(),
			await checkAlgolia(),
			await checkRedis(fastify.redis),
			await checkDatabase(fastify.pg.pool),
		]);

		if (isS3 === "OK" && isAlgolia === "OK" && isRedis === "OK" && isPostgres === "OK") {
			status = true;
		}

		if (!status) {
			fastify.log.error("Health check failed.");
			void reply.status(500);
		}

		return {
			request: status ? "OK" : "FAILED",
			timestamp: Date.now(),
			uptime: uptimeFormatter.format(process.uptime() * -1, "second"),
			s3: isS3,
			algolia: isAlgolia,
			redis: isRedis,
			postgres: isPostgres,
		};
	});
};
