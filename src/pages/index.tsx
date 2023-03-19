import React, { useState, useEffect } from "react";
import axios from "axios";
// Material UI imports
import {
  Container,
  ThemeProvider,
  createTheme,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Stack,
  Typography,
  Pagination,
} from "@mui/material";
import styles from "./index.module.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0f0",
    },
    background: {
      default: "#111111",
      paper: "#212121",
    },
  },
  typography: {
    fontFamily: "Open Sans",
    h1: {
      fontFamily: "Ubuntu Mono",
    },
    h2: {
      fontFamily: "Ubuntu Mono",
    },
    h3: {
      fontFamily: "Ubuntu Mono",
    },
    h4: {
      fontFamily: "Ubuntu Mono",
    },
    h6: {
      fontFamily: "Ubuntu Mono",
    },
    h5: {
      fontFamily: "Ubuntu Mono",
    },
    subtitle1: {
      fontFamily: "Ubuntu Mono",
    },
    subtitle2: {
      fontFamily: "Ubuntu Mono",
    },
    button: {
      fontFamily: "Ubuntu Mono",
      fontWeight: 900,
    },
    overline: {
      fontFamily: "Ubuntu Mono",
    },
  },
});

const EthereumTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);

  // UseEffect to fetch data and set state
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/api/transactionData");
        setTransactions(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransactions();

    const intervalId = setInterval(() => {
      fetchTransactions();
    }, 12000);

    return () => clearInterval(intervalId);
  }, []);

  // Pagination and display logic
  const handleChange = (event: any, value: any) => {
    setPage(value);
  };

  const transactionsPerPage = 10;
  const totalTransactions = transactions.length;
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);

  // displayTransactions limits the number of transactions displayed per page
  const start = (page - 1) * transactionsPerPage;
  const end = start + transactionsPerPage;
  const displayTransactions = transactions.slice(start, end);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ my: 10 }}>
        <Stack
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={4}
          display="flex"
        >
          <Typography variant="h3" align="center">
            Ethereum Transactions
          </Typography>
          {transactions.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={styles.underline}>
                    <Typography>From</Typography>
                  </TableCell>
                  <TableCell className={styles.underline}>
                    <Typography>To</Typography>
                  </TableCell>
                  <TableCell className={styles.underline}>
                    <Typography>Value (ETH)</Typography>
                  </TableCell>
                  <TableCell className={styles.underline}>
                    <Typography>Value (USD)</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayTransactions.map((transaction: any) => (
                  <TableRow key={transaction.hash}>
                    <TableCell className={styles.underline}>
                      <Typography>{transaction.from}</Typography>
                    </TableCell>
                    <TableCell className={styles.underline}>
                      <Typography>{transaction.to}</Typography>
                    </TableCell>
                    {transaction.valueEth !== undefined && (
                      <TableCell className={styles.underline}>
                        <Typography>
                          {transaction.valueEth === 0
                            ? "0"
                            : transaction.valueEth}
                        </Typography>
                      </TableCell>
                    )}
                    {transaction.valueUsd !== undefined && (
                      <TableCell className={styles.underline}>
                        <Typography>
                          {`$${
                            transaction.valueUsd === 0
                              ? "0"
                              : transaction.valueUsd
                          }`}
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography variant="h5" align="center">
              Waiting for a new block...
            </Typography>
          )}
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChange}
            color="primary"
          />
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default EthereumTransactions;
