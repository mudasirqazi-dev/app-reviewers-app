import React, { useEffect, useState } from "react";
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
  TableCell,
} from "@mui/material";
import {
  PersonOutlineTwoTone,
  AccessTimeTwoTone,
  EmailTwoTone,
} from "@mui/icons-material";
import moment from "moment";
import { Button } from "../../controls";
import { v4 as uuid } from "uuid";
import userService from "../../services/user";
import settingService from "../../services/setting";
import Utils from "../../utils/utils";

function PayButton({ user, text, value, ...rest }) {
  return (
    <Box sx={{ mb: 2 }}>
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
  let [buttons, setButtons] = useState([]);
  let [subAmount, setSubAmount] = useState("");

  const navigate = useNavigate();

  const { token, user, setUser, setIsLoading, isLoggedIn, setErrorMessage } =
    useStore((state) => state);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
    setIsLoading(true);

    userService.reload(token).then((r) => {
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

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
    setIsLoading(true);

    settingService.get(token).then((r) => {
      if (r.error) {
        setErrorMessage(r.error);
        setIsLoading(false);
        return;
      }
      if (r.data) {
        let btns = r.data.buttons.split(";");
        setButtons(btns);
        setSubAmount(r.data.subscription);
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
                    border: 0,
                  },
                }}
              >
                <TableCell align="right">
                  <PersonOutlineTwoTone />
                </TableCell>
                <TableCell component="th" scope="row" align="left">
                  {user.name}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell align="right">
                  <AccessTimeTwoTone />
                </TableCell>
                <TableCell component="th" scope="row" align="left">
                  Member since: {moment(user.joined).format("DD MMMM YYYY")}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell align="right">
                  <EmailTwoTone />
                </TableCell>
                <TableCell component="th" scope="row" align="left">
                  {user.email}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box component={Paper} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">
            Current Balance: {user?.points || 0} credits.
          </Typography>
        </Box>
        <Box component={Paper} sx={{ p: 2, mb: 2 }}>
          <Typography sx={{ mb: 1 }} variant="h6">
            One-time purchase
          </Typography>
          <Typography
            sx={{ mb: 2 }}
            variant="small"
            component="small"
            color="gray"
          >
            Buy more credits with following pre-defined amounts. New credits
            will be added in your existig balance.
          </Typography>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {/* <PayButton text="Purchase with $0.1" value={0.1} user={user} /> */}
            {buttons.map((amount) => {
              return (
                <PayButton
                  key={amount}
                  text={`Purchase with ${Utils.formatToCurrency(
                    amount.trim(),
                    "$"
                  )}`}
                  value={amount}
                  user={user}
                />
              );
            })}
          </Box>
        </Box>
        <Box component={Paper} sx={{ p: 2 }}>
          <Typography sx={{ mb: 1 }} variant="h6">
            Monthly subscription
          </Typography>
          <Typography
            sx={{ mb: 2 }}
            variant="small"
            component="small"
            color="gray"
          >
            With monthly subscription you'll be purchasing credits for{" "}
            {Utils.formatToCurrency(subAmount, "$")} every month and get a lot
            of extra benefits and free searches.
          </Typography>
          <Button
            text={`Monthly subscription in ${Utils.formatToCurrency(
              subAmount,
              "$"
            )}`}
            sx={{ mt: 1 }}
            color="info"
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default Profile;
