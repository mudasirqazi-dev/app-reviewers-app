import React, { useState } from "react";
import userService from "../../services/user";
import utils from "../../utils/utils";
import useStore from "../../store/store";
import moment from "moment";
import {
	Button,
	Text,
	Password,
	Error,
	Success,
	Heading,
	LinkButton
} from "../../controls";
import { PersonAdd } from "@mui/icons-material";
import { Container } from "@mui/material";

function Signup(props) {
	const { setIsLoading } = useStore(state => state);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleSubmit = e => {
		e.preventDefault();

		setErrorMessage("");
		setSuccessMessage("");

		if (!email || !password || !name) {
			setErrorMessage(`All fields are required.`);
			return;
		}
		if (!utils.isValidEmail(email)) {
			setErrorMessage(`Please provide a valid email address.`);
			return;
		}

		setIsLoading(true);
		userService
			.signup({
				name,
				email,
				password,
				type: "user",
				joined: moment().format()
			})
			.then(result => {
				if (result.error) {
					setErrorMessage(result.error);
					setIsLoading(false);
					return;
				}

				setErrorMessage("");
				setSuccessMessage(
					`Signup successful! Please check your mailbox to activate your account.`
				);
				setIsLoading(false);
			});
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 10 }}>
			<Heading text="Sign Up" sx={{ mt: 10, mb: 3 }} />
			<Text label="Full name" value={name} onChange={setName} />
			<Text label="Email address" value={email} onChange={setEmail} />
			<Password
				label="Password"
				value={password}
				onChange={setPassword}
			/>
			<Button
				text="Create Account"
				onClick={handleSubmit}
				sx={{ mt: 2, mb: 2 }}
				icon={<PersonAdd />}
			/>
			<Error text={errorMessage} />
			<Success text={successMessage} />
			<LinkButton
				label="Already have account?"
				text="Sign In"
				to="/login"
			/>
		</Container>
	);
}

export default Signup;
