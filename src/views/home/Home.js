import React, { useEffect, useState } from "react";
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
  Modal,
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
  CloseTwoTone,
} from "@mui/icons-material";
import { Button, Text } from "../../controls";
import appService from "../../services/app";
import smsService from "../../services/sms";
import { useTheme } from "@mui/material/styles";
import settingsService from "../../services/setting";
import Confirm from "../../components/Confirm";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const handleFirstPageButtonClick = (e) => onPageChange(e, 0);
  const handleBackButtonClick = (e) => onPageChange(e, page - 1);
  const handleNextButtonClick = (e) => onPageChange(e, page + 1);

  const handleLastPageButtonClick = (e) =>
    onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
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
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const {
    token,
    user,
    isLoggedIn,
    setIsLoading,
    setSuccessMessage,
    setErrorMessage,
    setInfoMessage,
  } = useStore((state) => state);
  const [settings, setSettings] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [list, setList] = useState([]);
  const [list1, setList1] = useState([]);
  const [totalCost, setTotalCost] = useState(23);
  const [isDone, setIsDone] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setPage(0);
  };

  const [page1, setPage1] = useState(0);
  const [rowsPerPage1, setRowsPerPage1] = useState(10);
  const emptyRows1 =
    page1 > 0 ? Math.max(0, (1 + page1) * rowsPerPage1 - list1.length) : 0;
  const handleChangePage1 = (e, newPage) => setPage1(newPage);
  const handleChangeRowsPerPage1 = (e) => {
    setRowsPerPage1(parseInt(e.target.value));
    setPage1(0);
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState(null);
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSelectedUser(null);
    setMessage("");
    setOpen(false);
  };

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");

    settingsService.get(token).then((r) => {
      if (r.error) {
        setErrorMessage(r.error);
        return;
      }

      setSettings(r.data);
    });
  }, []);

  useEffect(() => {
    setName(selectedUser?.username || "");
  }, [selectedUser]);

  const handleSearch = () => {
    if (!token) return;
    if (keyword?.length < 3) return;
    setList([]);
    setList1([]);
    setIsLoading(true);
    setIsDone(false);
    appService
      .search(token, { keyword, userName: user.name })
      .then((result) => {
        if (result.error) {
          setErrorMessage(result.error);
          setIsLoading(false);
          return;
        }

        setList(result.data);
        setTotalCost(
          parseFloat(settings?.cost * result.data?.length).toFixed(2)
        );
        setIsLoading(false);
        setIsDone(true);
      });
  };

  const handleGetDetails = () => {
    if (!token) return;

    if (totalCost > user?.points) {
      setInfoMessage(
        "You have insufficient account balance. Your request is not completed."
      );
      return;
    }

    setList1([]);
    setIsLoading(true);
    appService
      .getDetails(token, { keyword, totalCost, userName: user.name })
      .then((result) => {
        if (result.error) {
          setErrorMessage(result.error);
          setIsLoading(false);
          return;
        }

        setInfoMessage(
          `${totalCost} points are deducted from your credit balance.`
        );
        setList1(result.data);
        setIsLoading(false);
      });
  };

  const handleSendMessage = (data) => {
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
        message,
      })
      .then((result) => {
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
            Charges for more user details are {settings?.cost} credits per
            record. This search has found {list?.length} records and it will
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
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Send SMS
          </Typography>
          <Text value={selectedUser?.phone} disabled={true} label="Phone" />
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
            <Text
              label="Search Apps"
              value={keyword}
              onChange={setKeyword}
              error={keyword?.length < 3}
              helperText="Keyword should be at least 3 characters"
            />
            <Button
              text="Search"
              onClick={handleSearch}
              icon={<SearchTwoTone />}
            />
            {isDone && list.length > 0 && (
              <>
                <Typography sx={{ mt: 3, mb: 1 }}>
                  Charges for more user details are {settings?.cost} credits per
                  record. This search has found {list?.length} records and it
                  will cost{" "}
                  <Typography
                    color="primary"
                    variant="span"
                    sx={{ fontWeight: "bold" }}
                  >
                    {totalCost}
                  </Typography>{" "}
                  credits. Do you want to proceed?
                </Typography>
                <Button
                  text="Yes! Get Details"
                  onClick={() => setOpenConfirmDialog(true)}
                  color="info"
                  icon={<PersonSearchTwoTone />}
                />
                <TableContainer sx={{ mt: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell component="th" scope="row" align="left">
                          Username ({list.length} records)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? list.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : list
                      ).map((row) => (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell component="td" scope="row" align="left">
                            {row?.username}
                          </TableCell>
                        </TableRow>
                      ))}
                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: 53 * emptyRows,
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
                              value: -1,
                            },
                          ]}
                          colSpan={1}
                          count={list?.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            inputProps: {
                              "aria-label": "rows per page",
                            },
                            native: true,
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </>
            )}
            {isDone && list.length === 0 && (
              <Typography sx={{ mt: 1 }}>No data found.</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          {list1.length > 0 && (
            <>
              <Box component={Paper} sx={{ p: 2 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Detailed search results
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell component="th" scope="row" align="left">
                          Username
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
                          Country
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
                          Phone
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage1 > 0
                        ? list1.slice(
                            page1 * rowsPerPage1,
                            page1 * rowsPerPage1 + rowsPerPage1
                          )
                        : list1
                      ).map((row) => (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell component="td" scope="row" align="left">
                            {row?.username}
                          </TableCell>
                          <TableCell component="td" scope="row" align="left">
                            {row?.country}
                          </TableCell>
                          <TableCell component="td" scope="row" align="center">
                            {row?.phone}
                          </TableCell>
                          <TableCell component="td" scope="row" align="left">
                            <Button
                              text="SMS"
                              color="grey"
                              size="small"
                              onClick={() => handleSendMessage(row)}
                              icon={<PhoneIphoneTwoTone />}
                              style={{
                                height: "auto",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {emptyRows1 > 0 && (
                        <TableRow
                          style={{
                            height: 53 * emptyRows1,
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
                              value: -1,
                            },
                          ]}
                          colSpan={4}
                          count={list1?.length}
                          rowsPerPage={rowsPerPage1}
                          page={page1}
                          SelectProps={{
                            inputProps: {
                              "aria-label": "rows per page",
                            },
                            native: true,
                          }}
                          onPageChange={handleChangePage1}
                          onRowsPerPageChange={handleChangeRowsPerPage1}
                          ActionsComponent={TablePaginationActions}
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
