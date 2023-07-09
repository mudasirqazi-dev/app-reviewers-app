import React, { useEffect, useState, useRef } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
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
	IconButton,
	Checkbox,
	Modal
} from "@mui/material";
import {
	LastPage as LastPageIcon,
	KeyboardArrowRight,
	KeyboardArrowLeft,
	FirstPage as FirstPageIcon,
	SearchTwoTone,
	PersonSearchTwoTone,
	PhoneIphoneTwoTone,
	SendTwoTone,
	CloseTwoTone
} from "@mui/icons-material";
import { Button, Text } from "../../controls";
import appService from "../../services/app";
import smsService from "../../services/sms";
import { useTheme } from "@mui/material/styles";
import settingsService from "../../services/setting";
import userService from "../../services/user";
import Confirm from "../../components/Confirm";
import Utils from "../../utils/utils";
import moment from "moment";
import Select from "react-select";
import { MuiChipsInput } from "mui-chips-input";
import Constants from "../../utils/constants";

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

function Home() {
	const navigate = useNavigate();
	const [keyword, setKeyword] = useState([]);
	const {
		token,
		user,
		setUser,
		isLoggedIn,
		setIsLoading,
		setSuccessMessage,
		setErrorMessage,
		setInfoMessage
	} = useStore(state => state);
	const [settings, setSettings] = useState(null);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [list, setList] = useState([]);
	const [list1, setList1] = useState([]);
	const [history, setHistory] = useState([]);
	const [totalCost, setTotalCost] = useState(23);
	const [isDone, setIsDone] = useState(false);

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;
	const handleChangePage = (e, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = e => {
		setRowsPerPage(parseInt(e.target.value));
		setPage(0);
	};

	const [page1, setPage1] = useState(0);
	const [rowsPerPage1, setRowsPerPage1] = useState(10);
	const emptyRows1 =
		page1 > 0 ? Math.max(0, (1 + page1) * rowsPerPage1 - list1.length) : 0;
	const handleChangePage1 = (e, newPage) => setPage1(newPage);
	const handleChangeRowsPerPage1 = e => {
		setRowsPerPage1(parseInt(e.target.value));
		setPage1(0);
	};

	const [selectedUser, setSelectedUser] = useState(null);
	const [message, setMessage] = useState(null);
	const [open, setOpen] = useState(false);
	const handleClose = () => {
		setSelectedUser(null);
		setSelectedPhoneNumbersForSms([]);
		setMessage("");
		setOpen(false);
	};
	const [checkedRows, setCheckedRows] = useState([]);
	const [phoneNumbersCount, setPhoneNumbersCount] = useState(0);
	const [selectedPhoneNumbersForSms, setSelectedPhoneNumbersForSms] =
		useState([]);

	useEffect(() => {
		if (!isLoggedIn) navigate("/login");

		setKeyword(
			user?.searchKeywords?.split(";").filter(k => k.length !== 0) || []
		);

		settingsService.get(token).then(r => {
			if (r.error) {
				setErrorMessage(r.error);
				return;
			}

			setSettings(r.data);
		});
	}, []);

	const handleSearch = () => {
		if (!token) {
			setErrorMessage(`Please login first to use this application.`);
			return;
		}
		if (keyword?.length < 1) {
			setErrorMessage(`Please provide atleast one application name.`);
			return;
		}
		setList([]);
		setList1([]);
		setIsLoading(true);
		setIsDone(false);
		appService
			.search(token, { keyword, userName: user.name, addSearchRecord: true  })
			.then(result => {
				if (result.error) {
					setErrorMessage(result.error);
					setIsLoading(false);
					return;
				}

				let list = result.data.list;
				let t = [];
				result.data.history.forEach(h =>
					h.results.forEach(k => t.push(k))
				);
				setList1(t);
				list = list.filter(k => t.findIndex(l => l?.username?.toLowerCase() === k.username?.toLowerCase()) === -1);
				setList(list);
				setHistory(t);
				setCheckedRows([]);
				setIsLoading(false);
				setIsDone(true);
			});
	};

	const handleGetDetails = () => {
		if (!token) return;

		setList1([]);
		setHistory([]);
		setIsLoading(true);
		appService
			.getDetails(token, {
				keyword,
				selectedUsers: checkedRows
			})
			.then(result => {
				if (result.error) {
					setErrorMessage(result.error);
					setIsLoading(false);
					return;
				}

				setInfoMessage(
					`${totalCost} points are deducted from your credit balance.`
				);
				
				appService
					.search(token, { keyword, userName: user.name, addSearchRecord: false })
					.then(result => {
						if (result.error) {
							setErrorMessage(result.error);
							setIsLoading(false);
							return;
						}

						let list = result.data.list;
						let t = [];
						result.data.history.forEach(h =>
							h.results.forEach(k => t.push(k))
						);
						setList1(t);
						list = list.filter(k => t.findIndex(l => l?.username?.toLowerCase() === k.username?.toLowerCase()) === -1);
						setList(list);
						setHistory(t);
						setCheckedRows([]);
						setIsLoading(false);
						setIsDone(true);
					});

				userService.reload(token).then(r => {
					if (r.error) {
						setErrorMessage(r.error);
						setIsLoading(false);
						return;
					}
					setUser(r.data);
					setIsLoading(false);
				});
				setIsLoading(false);
			});
	};

	const handleSendMessage = data => {
		if (!token) return;
		setSelectedUser(data);
		setOpen(true);
	};

	const handleSend = () => {
		if (!token || !selectedUser || selectedPhoneNumbersForSms.length === 0)
			return;
		if (!message || message?.length === 0) return;

		setIsLoading(true);
		smsService
			.sendSms(token, {
				numbers: selectedPhoneNumbersForSms.map(k => k.value),
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

	const handleCheck = (event, row) => {
		const checked = event.target.checked;
		const newCheckedRows = checked
			? [...checkedRows, row]
			: checkedRows.filter(r => r !== row);
		setCheckedRows(newCheckedRows);
	};

	useEffect(() => {
		let t = checkedRows?.reduce((a, b) => a + b.contacts, 0);
		setPhoneNumbersCount(t);
		setTotalCost(parseFloat(settings?.cost * t).toFixed(2));
	}, [checkedRows]);

	const onChangeKeyword = v => {
		setKeyword(v);
		userService
			.updateSearchKeywords(token, { searchKeywords: v.join(";") })
			.then(r => {
				if (r.error) {
					setErrorMessage(r.error);
					return;
				}
				setUser(r.data);
			});
	};

	const handleSelectAll = (event) => {
		const checked = event.target.checked;
		const newCheckedRows = checked ? list : [];
		setCheckedRows(newCheckedRows);
  };

	return (
		<>
			<Confirm
				open={openConfirmDialog}
				onNo={() => setOpenConfirmDialog(false)}
				onYes={() => {
					setOpenConfirmDialog(false);
					handleGetDetails();
				}}
				title="Are you sure?"
				body={
					<Typography>
						Charges for more user details are {settings?.cost}{" "}
						credits per phone number. You have selected{" "}
						<Typography
							color="primary"
							variant="span"
							sx={{ fontWeight: "bold" }}
						>
							{Utils.formatToNumber(checkedRows?.length)}
						</Typography>{" "}
						records ({phoneNumbersCount} phone numbers) and it will
						cost{" "}
						<Typography
							color="primary"
							variant="span"
							sx={{ fontWeight: "bold" }}
						>
							{totalCost}
						</Typography>{" "}
						credits. Do you want to proceed?
						<br />
						This action is not revertable.
					</Typography>
				}
			/>

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
						p: 4,
						maxHeight: 550,
						overflow: "auto"
					}}
				>
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2"
						sx={{ mb: 2 }}
					>
						Send SMS
					</Typography>
					<Select
						value={selectedPhoneNumbersForSms}
						onChange={setSelectedPhoneNumbersForSms}
						isMulti={true}
						styles={{
							control: base => ({
								...base,
								minHeight: 55,
								height: "auto"
							}),
							option: (
								base,
								{ data, isDisabled, isFocused, isSelected }
							) => base,
							input: base => base,
							placeholder: base => base,
							singleValue: (base, { data }) => base,
							menuPortal: base => base,
							menu: base => ({ ...base, zIndex: 9 })
						}}
						options={selectedUser?.contacts?.map(k => ({
							label: `${k.firstname} ${k.surname} (${k.phone})`,
							value: k
						}))}
					/>
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

			<Grid container spacing={2} sx={{ p: 2, pt: 2 }}>
				<Grid item xs={12} md={12}>
					<Typography component="p" variant="h4">
						Dashboard
					</Typography>
				</Grid>
				<Grid item xs={12} md={6}>
					<Box component={Paper} sx={{ p: 2 }}>
						<Typography variant="h5" sx={{ mb: 2 }}>
							Search applications
						</Typography>
						<MuiChipsInput
							value={keyword}
							onChange={onChangeKeyword}
							style={{ width: "100%" }}
						/>
						<small style={{ color: "#BCBCBC" }}>
							* Type app name and press Enter button <br />*
							Double click to edit a chip
						</small>
						<Button
							text="Search"
							onClick={handleSearch}
							icon={<SearchTwoTone />}
							sx={{ mt: 2 }}
						/>
						{isDone && list.length > 0 && (
							<>
								<Typography sx={{ mt: 3, mb: 1 }}>
									Charges for more user details are{" "}
									{settings?.cost} credits per phone number.{" "}
									{checkedRows.length > 0 ? (
										<>
											You have selected{" "}
											<Typography
												color="primary"
												variant="span"
												sx={{ fontWeight: "bold" }}
											>
												{Utils.formatToNumber(
													checkedRows?.length
												)}
											</Typography>{" "}
											records ({phoneNumbersCount} phone
											numbers ) and it will cost{" "}
											<Typography
												color="primary"
												variant="span"
												sx={{ fontWeight: "bold" }}
											>
												{totalCost}
											</Typography>{" "}
											credits. Do you want to proceed?
										</>
									) : (
										"Select the records you want to get details of."
									)}
								</Typography>
								<Button
									text="Yes! Get Details"
									onClick={() => {
										checkedRows.length > 0
											? setOpenConfirmDialog(true)
											: setErrorMessage(
													"Please select the names first."
											  );
									}}
									color="info"
									icon={<PersonSearchTwoTone />}
								/>
								<TableContainer sx={{ mt: 3 }}>
									<Table size="small">
										<TableHead>
											<TableRow>
												<TableCell
													component="th"
													scope="row"
													align="left"
												>
													<Checkbox
														color="primary"
														checked={
															checkedRows.length ===
															list.length
														}
														indeterminate={
															checkedRows.length >
																0 &&
															checkedRows.length <
																list.length
														}
														onChange={handleSelectAll}
													/>
													Username ({list.length}{" "}
													records)
												</TableCell>
												<TableCell
													component="th"
													scope="row"
													align="left"
												>
													App
												</TableCell>
												<TableCell
													component="th"
													scope="row"
													align="left"
												>
													Source
												</TableCell>
												<TableCell
													component="th"
													scope="row"
													align="left"
												>
													Date
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{(rowsPerPage > 0
												? list.slice(
														page * rowsPerPage,
														page * rowsPerPage +
															rowsPerPage
												  )
												: list
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
														<Checkbox
															color="primary"
															checked={checkedRows.includes(
																row
															)}
															onChange={event =>
																handleCheck(
																	event,
																	row
																)
															}
															disabled={list1.findIndex(k => k?.username?.toLowerCase() === row?.username?.toLowerCase()) !== -1}
														/>
														<span>
															{row?.username}{" "}
															{row?.contacts >
																1 && (
																<>
																	<br />
																	<div
																		style={{
																			paddingLeft: 40,
																			marginTop:
																				-10,
																			fontSize: 12
																		}}
																	>
																		{row?.contacts -
																			1}{" "}
																		more
																		phone
																		numbers
																		with
																		similar
																		name
																	</div>
																</>
															)}
														</span>
													</TableCell>
													<TableCell
														component="td"
														scope="row"
														align="left"
													>
														{row?.app}
													</TableCell>
													<TableCell
														component="td"
														scope="row"
														align="left"
													>
														{row?.from}
													</TableCell>
													<TableCell
														component="td"
														scope="row"
														align="left"
													>
														{moment(
															row?.datetime
														).format("DD MMM YYYY")}
													</TableCell>
												</TableRow>
											))}
											{emptyRows > 0 && (
												<TableRow
													style={{
														height: 53 * emptyRows
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
													count={list?.length}
													rowsPerPage={rowsPerPage}
													page={page}
													SelectProps={{
														inputProps: {
															"aria-label":
																"rows per page"
														},
														native: true
													}}
													onPageChange={
														handleChangePage
													}
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
							</>
						)}
						{isDone && list.length === 0 && (
							<Typography sx={{ mt: 1 }}>
								No data found.
							</Typography>
						)}
					</Box>
				</Grid>
				<Grid item xs={12} md={6}>
					{list1.length > 0 && (
						<>
							<Box component={Paper} sx={{ p: 2 }}>
								<Typography variant="h5" sx={{ mb: 2 }}>
									{history?.length > 0
										? "Records you already own"
										: "Detailed search results"}
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
												? list1.slice(
														page1 * rowsPerPage1,
														page1 * rowsPerPage1 +
															rowsPerPage1
												  )
												: list1
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
														{row?.username} {row?.contacts?.length > 1 && <>(
														{row?.contacts?.length})</>}
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
														align="left"
													>
														{row?.contacts?.map(
															k => (
																<div>
																	<span
																		style={{
																			fontSize: 11
																		}}
																	>
																		{
																			k.firstname
																		}{" "}
																		{
																			k.surname
																		}
																	</span>{" "}
																	<span
																		style={{
																			color: Constants.PRIMARY,
																			fontSize: 12
																		}}
																	>
																		{
																			k.phone
																		}
																	</span>
																</div>
															)
														)}
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
													count={list1?.length}
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

export default Home;
