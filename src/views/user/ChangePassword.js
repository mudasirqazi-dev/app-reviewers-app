import React, { useState } from "react";
import userService from "../../services/user";
import useStore from "../../store/store";
import { Button, Password, Error, Success, Heading } from "../../controls";
import { Key } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";

function ChangePassword() {
	const { token, setIsLoading } = useStore(state => state);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleSubmit = e => {
		e.preventDefault();

		setErrorMessage("");
		setSuccessMessage("");

		if (!newPassword || !repeatPassword || !currentPassword) {
			setErrorMessage(`Please provide all fields.`);
			return;
		}

		if (newPassword !== repeatPassword) {
			setErrorMessage(`New password did not match.`);
			return;
		}

		setIsLoading(true);
		userService
			.updatePassword(token, { currentPassword, newPassword })
			.then(result => {
				if (result.error) {
					setErrorMessage(result.error);
					setIsLoading(false);
					return;
				}

				setIsLoading(false);
				setErrorMessage("");
				setSuccessMessage(
					`Password updated successfully! Use new password to login next time.`
				);
			});
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={12}>
				<Typography variant="h5" sx={{ float: "left" }}>
					Change password
				</Typography>
			</Grid>
			<Grid item xs={12} md={12}>
				<Password
					label="Current Password"
					value={currentPassword}
					onChange={setCurrentPassword}
				/>
			</Grid>
			<Grid item xs={12} md={12}>
				<Password
					label="New Password"
					value={newPassword}
					onChange={setNewPassword}
				/>
			</Grid>
			<Grid item xs={12} md={12}>
				<Password
					label="Repeat Password"
					value={repeatPassword}
					onChange={setRepeatPassword}
				/>
			</Grid>
			<Grid item xs={12} md={12}>
				<Button
					text="Update Password"
					onClick={handleSubmit}
					sx={{ mt: 2, mb: 2 }}
					icon={<Key />}
				/>
			</Grid>
			<Grid item xs={12} md={12}>
				<Error text={errorMessage} />
				<Success text={successMessage} />
			</Grid>
		</Grid>
	);
}

export default ChangePassword;
