import { Link } from "react-router-dom";
import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { createElement, FC, Fragment, AnchorHTMLAttributes } from "react";

import { ClassNameBEMPropTypes, Handler } from "../../types";

const bem = createBEM("ModalButton");

const ModalButton: FC<ModalButtonPropTypes> = ({
	text,
	icon,
	link,
	onClick,
	onClose,
	className,
	externalLinkProps,
	externalLink = false,
}) => {
	const handleOnClick = () => {
		if (!externalLink && onClick) {
			void onClick();
		}
		if (onClose) {
			void onClose();
		}
	};

	const jsx = (
		<Button
			key={text}
			transparent
			icon={icon}
			text={text}
			onClick={handleOnClick}
			className={link ? null : bem(className, "ItemBorder")}
			style={{
				borderRadius: 0,
				flexGrow: link ? 1 : undefined,
			}}
		/>
	);

	return link ? (
		<Fragment>
			{externalLink ? (
				<a
					href={link}
					children={jsx}
					{...externalLinkProps}
					className={bem(className, "FlexRowCenter ItemBorder")}
				/>
			) : (
				<Link
					to={link}
					children={jsx}
					onClick={handleOnClick}
					className={bem(className, "FlexRowCenter ItemBorder")}
				/>
			)}
		</Fragment>
	) : (
		jsx
	);
};

export interface ModalButtonPropTypes extends ClassNameBEMPropTypes {
	text: string;
	icon?: string;
	link?: string;
	onClick?: Handler;
	onClose?: Handler;
	externalLink?: boolean;
	externalLinkProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
}

export default ModalButton;
