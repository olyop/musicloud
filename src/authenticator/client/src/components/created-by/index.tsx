import { FC, Fragment, createElement } from "react";

const CreatedBy: FC = () => (
	<p className="ParagraphTwo">
		<Fragment>Created by </Fragment>
		<a
			target="_blank"
			rel="noreferrer"
			className="Link"
			children={AUTHOR}
			href="https://olyop.com"
		/>
	</p>
);

export default CreatedBy;
