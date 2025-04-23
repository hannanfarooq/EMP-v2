import { useState } from 'react';
import {
  Card,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  CardHeader,
  TableContainer,
  TablePagination,
  Typography,
  Paper,
} from '@mui/material';
import Scrollbar from '../../components/scrollbar';
import { UserListHead } from '../../sections/@dashboard/user';
import { filter } from 'lodash';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'score', label: 'Score', alignRight: false },
];

function descendingComparator(a, b, orderBy) {
  if (orderBy === 'name') {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    if (nameB < nameA) return -1;
    if (nameB > nameA) return 1;
    return 0;
  }

  if (orderBy === 'score') {
    const scoreA = (a.userRewards || 0) + (a.readPolicies || 0) + (a.points || 0);
    const scoreB = (b.userRewards || 0) + (b.readPolicies || 0) + (b.points || 0);
    return scoreB - scoreA;
  }

  // fallback for any other property
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}


function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query.toLowerCase())
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function DashLeaderBoard({ data }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('score');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((user) => `${user.firstName} ${user.lastName}`);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <Card>
      <CardHeader title="Leader Board" />
      <Scrollbar>
        <TableContainer sx={{ mt: 1, minWidth: 300 }}>
          <Table>
            <UserListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={data.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => {
                  const {
                    id,
                    profilePic,
                    firstName,
                    lastName,
                    userRewards = 0,
                    readPolicies = 0,
                    points = 0,
                  } = user;
                  const name = `${firstName} ${lastName}`;
                  const score = userRewards + readPolicies + points;
                  const selectedUser = selected.includes(name);

                  return (
                    <TableRow hover key={id} tabIndex={-1} selected={selectedUser}>
                      <TableCell />
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={name} src={profilePic} />
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{score}</TableCell>
                    </TableRow>
                  );
                })}

              {isNotFound && (
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <Paper sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" paragraph>
                        Not found
                      </Typography>
                      <Typography variant="body2">
                        No results found for &nbsp;
                        <strong>&quot;{filterName}&quot;</strong>. Try checking for typos or using complete words.
                      </Typography>
                    </Paper>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
