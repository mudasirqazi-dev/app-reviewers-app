import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/store";
import {
	Grid,
	Typography,
	Box,
	Table,
	TableContainer,
	Paper,
	TableBody,
	TableRow,
	TableCell
} from "@mui/material";
import {
	PersonOutlineTwoTone,
	AccessTimeTwoTone,
	EmailTwoTone
} from "@mui/icons-material";
import moment from "moment";
import { Button } from "../../controls";
import { v4 as uuid } from "uuid";
import userService from "../../services/user";

function PayButton({ user, text, value, ...rest }) {
	return (
		<Box>
			<form method="POST" action={process.env.REACT_APP_BTC_STORE_URL}>
				<input type="hidden" name="amount" value={value} />
				<input type="hidden" name="email" value={user?.email} />
				<input type="hidden" name="orderId" value={uuid()} />
				<input
					type="hidden"
					name="notificationUrl"
					// value={`https://c020-39-37-227-167.eu.ngrok.io/api/payments/`}
					value={`${process.env.REACT_APP_API_URL}/payments/`}
				/>
				<input
					type="hidden"
					name="redirectUrl"
					value={`${process.env.REACT_APP_URL}/profile`}
				/>
				<Button text={text} type="submit" {...rest} />
			</form>
		</Box>
	);
}

function Profile(props) {
	const navigate = useNavigate();
	const { token, user, setUser, setIsLoading, setErrorMessage } = useStore(
		state => state
	);

	useEffect(() => {
		setIsLoading(true);
		userService.reload(token).then(r => {
			if (r.error) {
				setErrorMessage(r.error);
				setIsLoading(false);
				return;
			}
			if (r.data) {
				setUser(r.data);
				setIsLoading(false);
			}
		});
	}, []);

	return (
		<Grid container spacing={2} sx={{ p: 2, pt: 2 }}>
			<Grid item xs={12} md={12}>
				<Typography component="p" variant="h4">
					Profile
				</Typography>
			</Grid>
			<Grid item xs={12} md={6}>
				<TableContainer component={Paper}>
					<Table>
						<TableBody>
							<TableRow
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0
									}
								}}
							>
								<TableCell align="right">
									<PersonOutlineTwoTone />
								</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="left"
								>
									{user.name}
								</TableCell>
							</TableRow>
							<TableRow
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0
									}
								}}
							>
								<TableCell align="right">
									<AccessTimeTwoTone />
								</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="left"
								>
									Member since:{" "}
									{moment(user.joined).format("DD MMMM YYYY")}
								</TableCell>
							</TableRow>
							<TableRow
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0
									}
								}}
							>
								<TableCell align="right">
									<EmailTwoTone />
								</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="left"
								>
									{user.email}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
			<Grid item xs={12} md={6}>
				<Box component={Paper} sx={{ p: 2 }}>
					<Typography sx={{ mb: 2 }}>
						Current Balance: {user?.points || 0} credits.
					</Typography>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							flexDirection: "row"
						}}
					>
						{/* <PayButton
							text="Purchase with $0.1"
							value={0.1}
							user={user}
						/> */}
						<PayButton
							text="Purchase with $10"
							value={10}
							user={user}
						/>
						<PayButton
							text="Purchase with $30"
							value={30}
							user={user}
						/>
						<PayButton
							text="Purchase with $50"
							value={50}
							user={user}
						/>
					</Box>
					<Button text="Custom Amount" sx={{ mt: 1 }} />
				</Box>
			</Grid>
		</Grid>
	);
}

export default Profile;
