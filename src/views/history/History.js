import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import historyServices from "../../services/history";
import smsService from "../../services/sms";
import moment from "moment";
import {
	Grid,
	Typography,
	Box,
	Table,
	TableContainer,
	Paper,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TableFooter,
	TablePagination,
	Modal,
	IconButton
} from "@mui/material";
import {
	LastPage as LastPageIcon,
	KeyboardArrowRight,
	KeyboardArrowLeft,
	PhoneIphoneTwoTone,
	FirstPage as FirstPageIcon,
	SendTwoTone,
	CloseTwoTone,
	Search
} from "@mui/icons-material";
import { Text, Button } from "../../controls";
import DateRangePicker from "../../controls/DateRangePicker";
import { useTheme } from "@mui/material/styles";
import Utils from "../../utils/utils";

function TablePaginationActions(props) {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;
	const handleFirstPageButtonClick = e => onPageChange(e, 0);
	const handleBackButtonClick = e => onPageChange(e, page - 1);
	const handleNextButtonClick = e => onPageChange(e, page + 1);

	const handleLastPageButtonClick = e =>
		onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === "rtl" ? (
					<LastPageIcon />
				) : (
					<FirstPageIcon />
				)}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowRight />
				) : (
					<KeyboardArrowLeft />
				)}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowLeft />
				) : (
					<KeyboardArrowRight />
				)}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === "rtl" ? (
					<FirstPageIcon />
				) : (
					<LastPageIcon />
				)}
			</IconButton>
		</Box>
	);
}

function History() {
	const navigate = useNavigate();
	const [keyword, setKeyword] = useState("");
	const [searches, setSearches] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [arr, setArr] = useState([
		moment().startOf("month").format("YYYY-MM-DD"),
		moment().endOf("month").format("YYYY-MM-DD")
	]);
	const [history, setHistory] = useState([]);

	const {
		token,
		user,
		isLoggedIn,
		setSuccessMessage,
		setIsLoading,
		setErrorMessage
	} = useStore(state => state);

	const [isDone, setIsDone] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - searches.length) : 0;
	const handleChangePage = (e, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = e => {
		setRowsPerPage(parseInt(e.target.value));
		setPage(0);
	};

	const [page1, setPage1] = useState(0);
	const [rowsPerPage1, setRowsPerPage1] = useState(10);
	const emptyRows1 =
		page1 > 0
			? Math.max(0, (1 + page1) * rowsPerPage1 - history.length)
			: 0;
	const handleChangePage1 = (e, newPage) => setPage1(newPage);
	const handleChangeRowsPerPage1 = e => {
		setRowsPerPage1(parseInt(e.target.value));
		setPage1(0);
	};

	const [name, setName] = useState(null);
	const [message, setMessage] = useState(null);
	const [open, setOpen] = useState(false);
	const handleClose = () => {
		setSelectedUser(null);
		setMessage("");
		setOpen(false);
	};

	useEffect(() => {
		if (!isLoggedIn) navigate("/login");
	}, []);

	useEffect(() => {
		reload();
	}, [keyword, arr]);

	useEffect(() => {
		setName(selectedUser?.username || "");
	}, [selectedUser]);

	const reload = () => {
		if (!keyword) setIsLoading(true);
		let from = arr[0];
		let to = arr[1];
		historyServices
			.getByUserId(token, { keyword: keyword, from, to })
			.then(result => {
				if (result.error) {
					setErrorMessage(result.error);
					setIsLoading(false);
					return;
				}
				setSearches(result.data);
				setIsDone(true);
				setIsLoading(false);
			});
	};

	const handleSendMessage = data => {
		if (!token) return;
		setSelectedUser(data);
		setOpen(true);
	};

	const handleSend = () => {
		if (!token || !selectedUser) return;
		if (!message || message?.length === 0) return;

		setIsLoading(true);
		smsService
			.sendSms(token, {
				phone: selectedUser.phone,
				username: selectedUser.username,
				message
			})
			.then(result => {
				if (result.error) {
					setErrorMessage(result.error);
					setIsLoading(false);
					return;
				}

				handleClose();
				setIsLoading(false);
				setSuccessMessage("SMS sent successfully.");
			});
	};

	return (
		<>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 500,
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4
					}}
				>
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Send SMS
					</Typography>
					<Text
						value={selectedUser?.phone}
						disabled={true}
						label="Phone"
					/>
					<Text value={name} onChange={setName} label="Name" />
					<Text
						value={message}
						onChange={setMessage}
						label="Message"
						multiline
						minRows={3}
						error={message?.length <= 0}
					/>
					<Button
						text="Send"
						onClick={handleSend}
						sx={{ mt: 1 }}
						icon={<SendTwoTone />}
					/>
					<Button
						text="Cancel"
						onClick={handleClose}
						sx={{ mt: 1 }}
						icon={<CloseTwoTone />}
					/>
				</Box>
			</Modal>

			<Grid container spacing={2} sx={{ p: 2 }}>
				<Grid item xs={12} md={12}>
					<Typography component="p" variant="h4">
						History
					</Typography>
				</Grid>

				<Grid item xs={12} md={12}>
					<Box component={Paper} sx={{ p: 2 }}>
						<Grid container>
							<Grid item variant="h6" xs={8} md={8}>
								<Text
									label="Type to search keyword"
									value={keyword}
									onChange={setKeyword}
								/>
							</Grid>
							<Grid item xs={4} md={4} sx={{ pl: 2 }}>
								<DateRangePicker arr={arr} setArr={setArr} />
							</Grid>
						</Grid>
					</Box>
				</Grid>

				<Grid item xs={6} md={6}>
					<Box component={Paper} sx={{ p: 2 }}>
						{isDone && searches.length > 0 && (
							<TableContainer>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell
												component="th"
												scope="row"
												align="left"
											>
												Keyword ({searches.length}{" "}
												records)
											</TableCell>
											<TableCell
												component="th"
												scope="row"
												align="right"
											>
												Credits
											</TableCell>
											<TableCell
												component="th"
												scope="row"
												align="right"
											>
												Results
											</TableCell>
											<TableCell
												component="th"
												scope="row"
												align="center"
											>
												Date
											</TableCell>
											<TableCell
												component="th"
												scope="row"
												align="center"
											>
												Action
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{(rowsPerPage > 0
											? searches.slice(
													page * rowsPerPage,
													page * rowsPerPage +
														rowsPerPage
											  )
											: searches
										).map(row => (
											<TableRow
												key={row._id}
												sx={{
													"&:last-child td, &:last-child th":
														{
															border: 0
														}
												}}
											>
												<TableCell
													component="td"
													scope="row"
													align="left"
												>
													{row?.keyword}
												</TableCell>
												<TableCell
													component="td"
													scope="row"
													align="right"
												>
													{row?.cost > 0
														? Utils.formatToCurrency(
																row?.cost,
																""
														  )
														: "Free"}
												</TableCell>
												<TableCell
													component="td"
													scope="row"
													align="right"
												>
													{Utils.formatToNumber(
														row?.count
													)}
												</TableCell>
												<TableCell
													component="td"
													scope="row"
													align="center"
												>
													{moment(row?.date).format(
														"DD MMM YYYY"
													)}
												</TableCell>
												<TableCell
													component="td"
													scope="row"
													align="center"
												>
													<Button
														text="Details"
														color="grey"
														size="small"
														onClick={() =>
															setHistory(
																row?.results
															)
														}
														icon={<Search />}
														style={{
															height: "auto"
														}}
													/>
												</TableCell>
											</TableRow>
										))}
										{emptyRows > 0 && (
											<TableRow
												style={{
													height: 53 * emptyRows
												}}
											>
												<TableCell colSpan={1} />
											</TableRow>
										)}
									</TableBody>
									<TableFooter>
										<TableRow>
											<TablePagination
												rowsPerPageOptions={[
													10,
													20,
													30,
													{
														label: "All",
														value: -1
													}
												]}
												colSpan={7}
												count={searches?.length}
												rowsPerPage={rowsPerPage}
												page={page}
												SelectProps={{
													inputProps: {
														"aria-label":
															"rows per page"
													},
													native: true
												}}
												onPageChange={handleChangePage}
												onRowsPerPageChange={
													handleChangeRowsPerPage
												}
												ActionsComponent={
													TablePaginationActions
												}
											/>
										</TableRow>
									</TableFooter>
								</Table>
							</TableContainer>
						)}
						{isDone && searches.length === 0 && (
							<TableContainer>
								<Table size="small" sx={{ mt: 2 }}>
									<TableBody>
										<TableRow>
											<TableCell>
												No data found.
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						)}
					</Box>
				</Grid>

				<Grid item xs={12} md={6}>
					{history.length > 0 && (
						<>
							<Box component={Paper} sx={{ p: 2 }}>
								<Typography variant="h5" sx={{ mb: 2 }}>
									Paid Searches History
								</Typography>
								<TableContainer>
									<Table size="small">
										<TableHead>
											<TableRow>
												<TableCell
													component="th"
													scope="row"
													align="left"
												>
													Username
												</TableCell>
												<TableCell
													component="th"
													scope="row"
													align="left"
												>
													Country
												</TableCell>
												<TableCell
													component="th"
													scope="row"
													align="left"
												>
													Phone
												</TableCell>
												<TableCell
													component="th"
													scope="row"
													align="left"
												>
													Action
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{(rowsPerPage1 > 0
												? history.slice(
														page1 * rowsPerPage1,
														page1 * rowsPerPage1 +
															rowsPerPage1
												  )
												: history
											).map((row, idx) => (
												<TableRow
													key={idx}
													sx={{
														"&:last-child td, &:last-child th":
															{
																border: 0
															}
													}}
												>
													<TableCell
														component="td"
														scope="row"
														align="left"
													>
														{row?.username}
													</TableCell>
													<TableCell
														component="td"
														scope="row"
														align="left"
													>
														{row?.country}
													</TableCell>
													<TableCell
														component="td"
														scope="row"
														align="center"
													>
														{row?.phone}
													</TableCell>
													<TableCell
														component="td"
														scope="row"
														align="left"
													>
														<Button
															text="SMS"
															color="grey"
															size="small"
															onClick={() =>
																handleSendMessage(
																	row
																)
															}
															icon={
																<PhoneIphoneTwoTone />
															}
															style={{
																height: "auto"
															}}
														/>
													</TableCell>
												</TableRow>
											))}
											{emptyRows1 > 0 && (
												<TableRow
													style={{
														height: 53 * emptyRows1
													}}
												>
													<TableCell colSpan={4} />
												</TableRow>
											)}
										</TableBody>
										<TableFooter>
											<TableRow>
												<TablePagination
													rowsPerPageOptions={[
														10,
														20,
														30,
														{
															label: "All",
															value: -1
														}
													]}
													colSpan={4}
													count={history?.length}
													rowsPerPage={rowsPerPage1}
													page={page1}
													SelectProps={{
														inputProps: {
															"aria-label":
																"rows per page"
														},
														native: true
													}}
													onPageChange={
														handleChangePage1
													}
													onRowsPerPageChange={
														handleChangeRowsPerPage1
													}
													ActionsComponent={
														TablePaginationActions
													}
												/>
											</TableRow>
										</TableFooter>
									</Table>
								</TableContainer>
							</Box>
						</>
					)}
				</Grid>
			</Grid>
		</>
	);
}

export default History;
