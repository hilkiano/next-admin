import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  DataGrid,
  gridPageCountSelector,
  getGridStringOperators,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import { userService } from "../../services/userService";
import { myAlert, errorHandling } from "../reusable/MyAlert";
import { myDialog, MyDialog, useMyDialogStore } from "../reusable/MyDialog";
import { UserDialog, useUserDialogStore } from "../dialog/UserDialog";
import { useAuthStore } from "../store/AuthStore";

import AddIcon from "@mui/icons-material/Add";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";

const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

const getInitial = (name) => {
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

  const initials = [...name.matchAll(rgx)] || [];

  return (initials = (
    (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
  ).toUpperCase());
};

const stringAvatar = (name) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      fontSize: "0.95rem",
      width: "40px",
      height: "40px",
    },
    children: getInitial(name),
  };
};

const MyAvatar = (name) => {
  return <Avatar {...stringAvatar(name)} />;
};

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "avatar",
    headerName: "Avatar",
    width: 80,
    editable: false,
    renderCell: (v) => {
      return MyAvatar(v.row.name);
    },
    align: "center",
    sortable: false,
    filterable: false,
  },
  {
    field: "username",
    headerName: "Username",
    width: 200,
    filterOperators: getGridStringOperators().filter(
      (operator) =>
        operator.value === "contains" ||
        operator.value === "equals" ||
        operator.value === "startsWith" ||
        operator.value === "endsWith"
    ),
  },
  {
    field: "name",
    headerName: "Name",
    minWidth: 200,
    flex: 1,
    filterOperators: getGridStringOperators().filter(
      (operator) =>
        operator.value === "contains" ||
        operator.value === "equals" ||
        operator.value === "startsWith" ||
        operator.value === "endsWith"
    ),
  },
  {
    field: "email",
    headerName: "Email",
    minWidth: 200,
    flex: 1,
    filterOperators: getGridStringOperators().filter(
      (operator) =>
        operator.value === "contains" ||
        operator.value === "equals" ||
        operator.value === "startsWith" ||
        operator.value === "endsWith"
    ),
  },
];

export const UserPage = () => {
  const [selectedRow, setSelectedRow] = useState();
  const [contextMenu, setContextMenu] = useState(null);
  const auth = useAuthStore.getState().user;
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    sort: "asc",
    field: "id",
    filterField: null,
    filterMode: null,
    filterValue: null,
  });

  const CustomPagination = () => {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <Grid
        container
        direction="row"
        alignItems="baseline"
        justifyContent="space-between"
      >
        <Grid item>
          {matchesMd ? (
            <IconButton
              disabled={pageState.isLoading}
              sx={{ ml: matchesSm ? ".5em" : "1em" }}
              onClick={loadUserList}
              variant="outlined"
              size="small"
              color="primary"
            >
              <AutorenewIcon />
            </IconButton>
          ) : (
            <Button
              disabled={pageState.isLoading}
              sx={{ ml: matchesSm ? undefined : "1em" }}
              onClick={loadUserList}
              variant="outlined"
              size="small"
            >
              <AutorenewIcon sx={{ mr: ".5em" }} />
              Refresh grid
            </Button>
          )}
        </Grid>
        <Grid item>
          <Pagination
            size={matchesSm ? "small" : "medium"}
            disabled={pageState.isLoading}
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
          />
        </Grid>
      </Grid>
    );
  };

  const loadUserList = () => {
    setPageState((old) => ({ ...old, isLoading: true }));
    const param = {
      page: pageState.page,
      limit: pageState.pageSize,
      sort: pageState.sort,
      field: pageState.field,
      filterField: pageState.filterField,
      filterMode: pageState.filterMode,
      filterValue: pageState.filterValue,
    };
    userService.userList(param).then((res) => {
      if (!res.status) {
        setPageState((old) => ({ ...old, isLoading: false }));
        errorHandling(res.data);
      } else {
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: res.data.data,
          total: res.data.total,
        }));
      }
    });
  };

  const handleSortModelChange = useCallback((sortModel) => {
    if (sortModel[0]) {
      setPageState((old) => ({
        ...old,
        sort: sortModel[0].sort,
        field: sortModel[0].field,
      }));
    } else {
      setPageState((old) => ({ ...old, sort: "asc", field: "id" }));
    }
  }, []);

  const onFilterChange = useCallback((filterModel) => {
    if (filterModel.items[0]) {
      setPageState((old) => ({
        ...old,
        filterField: filterModel.items[0].columnField,
        filterMode: filterModel.items[0].operatorValue,
        filterValue: filterModel.items[0].value,
      }));
    }
  }, []);

  const ContextMenu = () => {
    return (
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        componentsProps={{
          root: {
            onContextMenu: (e) => {
              e.preventDefault();
              handleClose();
            },
          },
        }}
        PaperProps={{
          style: {
            width: 200,
          },
        }}
      >
        <MenuItem onClick={editRow}>
          <ListItemIcon>
            <UpdateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={deleteRestoreRow}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete/Restore</ListItemText>
        </MenuItem>
      </Menu>
    );
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    setSelectedRow(Number(event.currentTarget.getAttribute("data-id")));
    if (!pageState.isLoading) {
      setContextMenu(
        contextMenu === null
          ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
          : null
      );
    }
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const editRow = () => {
    pageState.data.map((row) => {
      if (row.id === selectedRow) {
        useUserDialogStore.setState((state) => {
          state.setUsername(row.username);
          state.setName(row.name);
          state.setEmail(row.email);
          state.setRowEdit(row);
        });
        myDialog(
          true,
          "form",
          "Edit User",
          <UserDialog type="edit" />,
          "sm",
          editUser,
          "Edit",
          () => {
            closeDialog();
            clearDialogState();
          },
          "Cancel"
        );
      }
    });

    handleClose();
  };

  const deleteRestoreRow = () => {
    pageState.data.map((row) => {
      if (row.id === selectedRow) {
        const mode = row.deleted_at ? "restore" : "delete";
        if (selectedRow === auth.id) {
          myAlert(
            true,
            "Warning!",
            `User ${row.username} is logged in. You cannot delete this user.`,
            "warning",
            "bottom",
            "right"
          );
        } else {
          myDialog(
            true,
            "confirm",
            `${mode.charAt(0).toUpperCase() + mode.slice(1)} user`,
            `Are you sure you want to ${mode} user ${row.username}?`,
            "xs",
            () => {
              mode === "delete" ? deleteUser(row) : restoreUser(row);
            },
            `${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
            closeDialog,
            "Cancel"
          );
          handleClose();
        }
      }
    });
  };

  const closeDialog = () => {
    useMyDialogStore.setState((state) => (state.open = false));
  };

  const clearDialogState = () => {
    useUserDialogStore.setState((state) => {
      state.setUsername("");
      state.setName("");
      state.setEmail("");
      state.setRowEdit(null);
    });
  };

  const addUser = () => {
    useMyDialogStore.setState((state) => (state.loading = true));
    const param = {
      username: useUserDialogStore.getState().username,
      name: useUserDialogStore.getState().name,
      email: useUserDialogStore.getState().email,
      password: "P@ssw0rd",
      password_confirmation: "P@ssw0rd",
    };
    userService.addUser(param).then((res) => {
      useMyDialogStore.setState((state) => (state.loading = false));
      if (!res.status) {
        errorHandling(res.data);
      } else {
        myAlert(
          true,
          "Success",
          `User ${param.username} has been added`,
          "success",
          "bottom",
          "right"
        );
        useMyDialogStore.setState((state) => {
          state.open = false;
          state.username = "";
          state.name = "";
          state.email = "";
        });
        loadUserList();
      }
    });
  };

  const editUser = () => {
    const param = {
      name: useUserDialogStore.getState().name,
      email: useUserDialogStore.getState().email,
      id: useUserDialogStore.getState().rowEdit.id,
    };
    useMyDialogStore.setState((state) => (state.loading = true));
    userService.updateUser(param).then((res) => {
      useMyDialogStore.setState((state) => (state.loading = false));
      if (!res.status) {
        errorHandling(res.data);
      } else {
        myAlert(
          true,
          "Success",
          `User ${useUserDialogStore.getState().username} has been edited`,
          "success",
          "bottom",
          "right"
        );
        useMyDialogStore.setState((state) => {
          state.open = false;
          state.username = "";
          state.name = "";
          state.email = "";
        });
        loadUserList();
      }
    });
  };

  const deleteUser = (row) => {
    const param = {
      id: row.id,
    };
    useMyDialogStore.setState((state) => (state.loading = true));
    userService.deleteUser(param).then((res) => {
      if (!res.status) {
        errorHandling(res.data);
      } else {
        myAlert(
          true,
          "Success",
          `User ${row.username} has been deleted`,
          "success",
          "bottom",
          "right"
        );
        myDialog(false);
        loadUserList();
      }
      useMyDialogStore.setState((state) => (state.loading = false));
    });
  };

  const restoreUser = (row) => {
    const param = {
      id: row.id,
    };
    useMyDialogStore.setState((state) => (state.loading = true));
    userService.restoreUser(param).then((res) => {
      if (!res.status) {
        errorHandling(res.data);
      } else {
        myAlert(
          true,
          "Success",
          `User ${row.username} has been restored`,
          "success",
          "bottom",
          "right"
        );
        myDialog(false);
        loadUserList();
      }
      useMyDialogStore.setState((state) => (state.loading = false));
    });
  };

  useEffect(() => {
    loadUserList();
  }, [
    pageState.page,
    pageState.pageSize,
    pageState.sort,
    pageState.field,
    pageState.filterField,
    pageState.filterMode,
    pageState.filterValue,
  ]);

  return (
    <Box>
      <Grid
        container
        sx={{ mb: "1em" }}
        direction={matchesSm ? "column" : "row"}
        rowSpacing={matchesSm ? 2 : undefined}
        justifyContent="space-between"
        alignItems={matchesSm ? "stretch" : "flex-end"}
      >
        <Grid item>
          <FormControl
            sx={{ minWidth: 150 }}
            size="small"
            fullWidth={matchesSm ? true : false}
          >
            <InputLabel id="select-rpp">Rows per page</InputLabel>
            <Select
              labelId="select-rpp"
              value={pageState.pageSize}
              label="Rows per page"
              onChange={(e) =>
                setPageState((old) => ({ ...old, pageSize: e.target.value }))
              }
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            onClick={() =>
              myDialog(
                true,
                "form",
                "Add User",
                <UserDialog type="add" />,
                "sm",
                addUser,
                "Add",
                () => {
                  closeDialog();
                  clearDialogState();
                },
                "Cancel"
              )
            }
            variant="contained"
            fullWidth={matchesSm ? true : false}
          >
            <AddIcon />
            Add User
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 630, width: "100%" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              sx={{
                height: "100%",
                width: "100%",
                "& .row-deleted": {
                  bgcolor: "#FFE6E6",
                  "&:hover": {
                    bgcolor: "#F2D1D1",
                  },
                },
              }}
              components={{
                Pagination: CustomPagination,
              }}
              componentsProps={{
                row: {
                  onContextMenu: handleContextMenu,
                  style: { cursor: "context-menu" },
                },
              }}
              onRowDoubleClick={(params, event) => {
                handleContextMenu(event);
              }}
              getRowClassName={(param) =>
                param.row.deleted_at ? `row-deleted` : ""
              }
              autoHeight={false}
              rows={pageState.data}
              rowCount={pageState.total}
              columns={columns}
              getRowId={(row) => row.id}
              page={pageState.page - 1}
              pageSize={pageState.pageSize}
              onPageChange={(newPage) => {
                setPageState((old) => ({ ...old, page: newPage + 1 }));
              }}
              onPageSizeChange={(newPageSize) =>
                setPageState((old) => ({ ...old, pageSize: newPageSize }))
              }
              disableSelectionOnClick
              loading={pageState.isLoading}
              pagination
              paginationMode="server"
              sortingMode="server"
              onSortModelChange={handleSortModelChange}
              filterMode="server"
              onFilterModelChange={onFilterChange}
            />
          </div>
        </div>
        <ContextMenu />
      </div>
      <MyDialog />
    </Box>
  );
};
