import React, { useState } from "react";
import userService from "../../services/user";
import useStore from "../../store/store";
import { Button, Text, Error, Success } from "../../controls";
import { Key, OpenInNew } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";

function SMSEdgeKey() {
	const { user, setUser, token, setIsLoading } = useStore(state => state);
	const [key, setKey] = useState(user?.smsedgeKey || "");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleSubmit = e => {
		e.preventDefault();

		setErrorMessage("");
		setSuccessMessage("");

		if (!key) {
			setErrorMessage(`Please provide a valid key.`);
			return;
		}

		setIsLoading(true);
		userService.updateSmsEdgeKey(token, { key }).then(result => {
			if (result.error) {
				setErrorMessage(result.error);
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
			setErrorMessage("");
			setUser(result.data);
			setSuccessMessage(`API Key updated successfully!`);
		});
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={12}>
				<Typography variant="h5" sx={{ float: "left" }}>
					SMSEdge API Key
				</Typography>
			</Grid>
			<Grid item xs={12} md={12}>
				<Typography variant="p">
					* To send SMS to the reviewers, your{" "}
					<a
						href="https://smsedge.com/"
						target="_blank"
						rel="noreferrer"
					>
						SMSEdge{" "}
						<OpenInNew style={{ fontSize: 16, color: "grey" }} />
					</a>{" "}
					account will be used. Therefore, please signup on{" "}
					<a
						href="https://smsedge.com/"
						target="_blank"
						rel="noreferrer"
					>
						SMSEdge{" "}
						<OpenInNew style={{ fontSize: 16, color: "grey" }} />
					</a>
					, generate your API key, paste it in the box below and save
					it. If you don't provide your API key, you'll not be able to
					send SMS.
				</Typography>
			</Grid>
			<Grid item xs={12} md={12}>
				<Text label="Paste your key" value={key} onChange={setKey} />
			</Grid>
			<Grid item xs={12} md={12}>
				<Button
					text="Save changes"
					onClick={handleSubmit}
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

export default SMSEdgeKey;
