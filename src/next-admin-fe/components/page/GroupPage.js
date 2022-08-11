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
import Chip from "@mui/material/Chip";

import { groupService } from "../../services/groupService";
import { myAlert, errorHandling } from "../reusable/MyAlert";
import { myDialog, MyDialog, useMyDialogStore } from "../reusable/MyDialog";
import { GroupDialog, useGroupDialogStore } from "../dialog/GroupDialog";

import AddIcon from "@mui/icons-material/Add";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "name",
    headerName: "Name",
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
    field: "description",
    headerName: "Description",
    width: 300,
    filterOperators: getGridStringOperators().filter(
      (operator) =>
        operator.value === "contains" ||
        operator.value === "equals" ||
        operator.value === "startsWith" ||
        operator.value === "endsWith"
    ),
  },
  {
    field: "roles",
    headerName: "Roles",
    width: 300,
    filterable: false,
    sortable: false,
    renderCell: (v) => {
      if (v.row.roles.length > 0) {
        return (
          <Box
            sx={{
              pt: ".5em",
              maxHeight: "inherit",
              width: "100%",
              whiteSpace: "initial",
              lineHeight: "16px",
            }}
          >
            {v.row.roles.slice(0, 3).map((role) => {
              return (
                <Chip
                  key={role.role.id}
                  icon={<LocalPoliceIcon />}
                  sx={{ mr: ".5em", mb: ".5em" }}
                  label={role.role.name}
                  variant="outlined"
                />
              );
            })}
            {v.row.roles.length > 3 ? (
              <Chip
                sx={{ mr: ".5em", mb: ".5em" }}
                label={`${v.row.roles.length - 3} +`}
                variant="filled"
                color="primary"
              />
            ) : (
              <></>
            )}
          </Box>
        );
      } else {
        return "-";
      }
    },
  },
  {
    field: "users",
    headerName: "Users",
    minWidth: 400,
    flex: 1,
    filterable: false,
    sortable: false,
    renderCell: (v) => {
      if (v.row.users.length > 0) {
        return (
          <Box
            sx={{
              pt: ".5em",
              maxHeight: "inherit",
              width: "100%",
              whiteSpace: "initial",
              lineHeight: "16px",
            }}
          >
            {v.row.users.slice(0, 3).map((user) => {
              return (
                <Chip
                  key={user.user.id}
                  icon={<PersonIcon />}
                  sx={{ mr: ".5em", mb: ".5em" }}
                  label={user.user.name}
                  variant="outlined"
                />
              );
            })}
            {v.row.users.length > 3 ? (
              <Chip
                sx={{ mr: ".5em", mb: ".5em" }}
                label={`${v.row.users.length - 3} +`}
                variant="filled"
                color="primary"
              />
            ) : (
              <></>
            )}
          </Box>
        );
      } else {
        return "-";
      }
    },
  },
];

export const GroupPage = () => {
  const [selectedRow, setSelectedRow] = useState();
  const [contextMenu, setContextMenu] = useState(null);
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
              onClick={loadGroupList}
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
              onClick={loadGroupList}
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

  const loadGroupList = () => {
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
    groupService.groupList(param).then((res) => {
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
        const userArr =
          row.users.length > 0
            ? row.users.map((user) => {
                return user.user;
              })
            : [];
        const roleArr =
          row.roles.length > 0
            ? row.roles.map((role) => {
                return role.role;
              })
            : [];
        useGroupDialogStore.setState((state) => {
          state.setName(row.name);
          state.setDescription(row.description);
          state.setUsers(userArr);
          state.setRoles(roleArr);
          state.setRowEdit(row);
        });
        myDialog(
          true,
          "form",
          "Edit Group",
          <GroupDialog type="edit" />,
          "sm",
          editGroup,
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
        myDialog(
          true,
          "confirm",
          `${mode.charAt(0).toUpperCase() + mode.slice(1)} group`,
          `Are you sure you want to ${mode} group ${row.name}?`,
          "xs",
          () => {
            mode === "delete" ? deleteGroup(row) : restoreGroup(row);
          },
          `${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
          closeDialog,
          "Cancel"
        );
        handleClose();
      }
    });
  };

  const closeDialog = () => {
    useMyDialogStore.setState((state) => (state.open = false));
  };

  const clearDialogState = () => {
    useGroupDialogStore.setState((state) => {
      state.setName(""),
        state.setDescription(""),
        state.setUsers([]),
        state.setRoles([]);
    });
  };

  const addGroup = () => {
    useMyDialogStore.setState((state) => (state.loading = true));
    const param = {
      name: useGroupDialogStore.getState().name,
      description: useGroupDialogStore.getState().description,
      users: useGroupDialogStore.getState().users,
      roles: useGroupDialogStore.getState().roles,
    };
    groupService.addGroup(param).then((res) => {
      useMyDialogStore.setState((state) => (state.loading = false));
      if (!res.status) {
        errorHandling(res.data);
      } else {
        myAlert(
          true,
          "Success",
          `Group ${param.name} has been added`,
          "success",
          "bottom",
          "right"
        );
        closeDialog();
        clearDialogState();
        loadGroupList();
      }
    });
  };

  const editGroup = () => {
    useMyDialogStore.setState((state) => (state.loading = true));
    const param = {
      id: useGroupDialogStore.getState().rowEdit.id,
      name: useGroupDialogStore.getState().name,
      description: useGroupDialogStore.getState().description,
      users: useGroupDialogStore.getState().users,
      roles: useGroupDialogStore.getState().roles,
    };
    groupService.updateGroup(param).then((res) => {
      useMyDialogStore.setState((state) => (state.loading = false));
      if (!res.status) {
        errorHandling(res.data);
      } else {
        myAlert(
          true,
          "Success",
          `Group ${useGroupDialogStore.getState().name} has been edited`,
          "success",
          "bottom",
          "right"
        );
        closeDialog();
        clearDialogState();
        loadGroupList();
      }
    });
  };

  const deleteGroup = (row) => {
    const param = {
      id: row.id,
    };
    useMyDialogStore.setState((state) => (state.loading = true));
    groupService.deleteGroup(param).then((res) => {
      if (!res.status) {
        errorHandling(res.data);
      } else {
        myAlert(
          true,
          "Success",
          `Group ${row.name} has been deleted`,
          "success",
          "bottom",
          "right"
        );
        closeDialog();
        loadGroupList();
      }
      useMyDialogStore.setState((state) => (state.loading = false));
    });
  };

  const restoreGroup = (row) => {
    const param = {
      id: row.id,
    };
    useMyDialogStore.setState((state) => (state.loading = true));
    groupService.restoreGroup(param).then((res) => {
      if (!res.status) {
        errorHandling(res.data);
      } else {
        myAlert(
          true,
          "Success",
          `Group ${row.name} has been restored`,
          "success",
          "bottom",
          "right"
        );
        closeDialog();
        loadGroupList();
      }
      useMyDialogStore.setState((state) => (state.loading = false));
    });
  };

  const reloadSelector = () => {
    useGroupDialogStore.setState((state) => (state.dropdownLoading = true));
    groupService.dropdownList().then((res) => {
      useGroupDialogStore.setState((state) => (state.dropdownLoading = false));
      if (!res.status) {
        errorHandling(res.data);
      } else {
        useGroupDialogStore.setState((state) => {
          state.setListUsers(res.data.data.users);
          state.setListRoles(res.data.data.roles);
        });
      }
    });
  };

  useEffect(() => {
    loadGroupList();
  }, [
    pageState.page,
    pageState.pageSize,
    pageState.sort,
    pageState.field,
    pageState.filterField,
    pageState.filterMode,
    pageState.filterValue,
  ]);

  useEffect(() => {
    reloadSelector();
  }, []);

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
            onClick={() => {
              myDialog(
                true,
                "form",
                "Add Group",
                <GroupDialog type="add" />,
                "sm",
                addGroup,
                "Add",
                () => {
                  closeDialog();
                  clearDialogState();
                },
                "Cancel"
              );
              useGroupDialogStore.setState(
                (state) => (state.reloadListFunc = reloadSelector)
              );
            }}
            variant="contained"
            fullWidth={matchesSm ? true : false}
          >
            <AddIcon />
            Add Group
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
              getRowHeight={() => "auto"}
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
