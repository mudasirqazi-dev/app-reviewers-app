import React, { useState, useEffect } from "react";
import userService from "../../services/user";
import utils from "../../utils/utils";
import { NavLink, Navigate } from "react-router-dom";
import {
	Button,
	Text,
	Password,
	Error,
	Success,
	Heading,
	LinkButton
} from "../../controls";
import { Login as LoginIcon } from "@mui/icons-material";
import { Container } from "@mui/material";

function Activate(props) {
	const [isActive, setIsActive] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [redirectTo, setRedirectTo] = useState(null);

	useEffect(() => {
		const token = utils.getUrlParam(window.location.href, "token", "");
		if (!token || token.length !== 24) {
			setErrorMessage(`Invalid token provided.`);
			return;
		}

		userService.activateAccount(token).then(result => {
			if (result.error) {
				setErrorMessage(result.error);
				return;
			}

			setErrorMessage("");
			setIsActive(true);
		});
	}, []);

	return (
		<Container maxWidth="sm" sx={{ mt: 10 }}>
			<Heading text="Activate your account" sx={{ mt: 10, mb: 3 }} />
			<Error text={errorMessage} />
			{isActive && (
				<Success
					text={
						"Your account is activated successfully! Please login and start using the application."
					}
				/>
			)}
			<LinkButton label="Want to login?" text="Sign In" to="/login" />
		</Container>
	);
}

export default Activate;
