import React, { useEffect, useState, useCallback, useContext } from "react";
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
import { UserContext } from "../context/UserContext";

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
import { useTranslation } from "next-i18next";

export const GroupPage = () => {
  const { user, setUser } = useContext(UserContext);
  // Privilege
  const canAddGroup = user.privileges.some((a) => a.name === "ACT_ADD_GROUP");
  const canEditGroup = user.privileges.some((a) => a.name === "ACT_EDIT_GROUP");
  const canDelResGroup = user.privileges.some(
    (a) => a.name === "ACT_DELETE_RESTORE_GROUP"
  );
  // End of privilege
  const { t } = useTranslation();

  const columns = [
    {
      field: "id",
      headerName: t("id", { ns: "group" }),
      width: 75,
      type: "number",
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
      headerName: t("name", { ns: "group" }),
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
      headerName: t("description", { ns: "group" }),
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
      headerName: t("roles", { ns: "group" }),
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
      headerName: t("users", { ns: "group" }),
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
  const [selectedRow, setSelectedRow] = useState();
  const [contextMenu, setContextMenu] = useState(null);
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const gridLocale = {
    noRowsLabel: t("noRowsLabel", { ns: "grid" }),
    noResultsOverlayLabel: t("noResultsOverlayLabel", { ns: "grid" }),
    errorOverlayDefaultLabel: t("errorOverlayDefaultLabel", { ns: "grid" }),
    columnsPanelTextFieldLabel: t("columnsPanelTextFieldLabel", { ns: "grid" }),
    columnsPanelTextFieldPlaceholder: t("columnsPanelTextFieldPlaceholder", {
      ns: "grid",
    }),
    columnsPanelDragIconLabel: t("columnsPanelDragIconLabel", { ns: "grid" }),
    columnsPanelShowAllButton: t("columnsPanelShowAllButton", { ns: "grid" }),
    columnsPanelHideAllButton: t("columnsPanelHideAllButton", { ns: "grid" }),
    filterPanelAddFilter: t("filterPanelAddFilter", { ns: "grid" }),
    filterPanelDeleteIconLabel: t("filterPanelDeleteIconLabel", { ns: "grid" }),
    filterPanelLinkOperator: t("filterPanelLinkOperator", { ns: "grid" }),
    filterPanelOperators: t("filterPanelOperators", { ns: "grid" }),
    filterPanelOperatorAnd: t("filterPanelOperatorAnd", { ns: "grid" }),
    filterPanelOperatorOr: t("filterPanelOperatorOr", { ns: "grid" }),
    filterPanelColumns: t("filterPanelColumns", { ns: "grid" }),
    filterPanelInputLabel: t("filterPanelInputLabel", { ns: "grid" }),
    filterPanelInputPlaceholder: t("filterPanelInputPlaceholder", {
      ns: "grid",
    }),
    filterOperatorContains: t("filterOperatorContains", { ns: "grid" }),
    filterOperatorEquals: t("filterOperatorEquals", { ns: "grid" }),
    filterOperatorStartsWith: t("filterOperatorStartsWith", { ns: "grid" }),
    filterOperatorEndsWith: t("filterOperatorEndsWith", { ns: "grid" }),
    filterOperatorIs: t("filterOperatorIs", { ns: "grid" }),
    filterOperatorNot: t("filterOperatorNot", { ns: "grid" }),
    filterOperatorAfter: t("filterOperatorAfter", { ns: "grid" }),
    filterOperatorOnOrAfter: t("filterOperatorOnOrAfter", { ns: "grid" }),
    filterOperatorBefore: t("filterOperatorBefore", { ns: "grid" }),
    filterOperatorOnOrBefore: t("filterOperatorOnOrBefore", { ns: "grid" }),
    filterOperatorIsEmpty: t("filterOperatorIsEmpty", { ns: "grid" }),
    filterOperatorIsNotEmpty: t("filterOperatorIsNotEmpty", { ns: "grid" }),
    filterOperatorIsAnyOf: t("filterOperatorIsAnyOf", { ns: "grid" }),
    filterValueAny: t("filterValueAny", { ns: "grid" }),
    filterValueTrue: t("filterValueTrue", { ns: "grid" }),
    filterValueFalse: t("filterValueFalse", { ns: "grid" }),
    columnMenuLabel: t("columnMenuLabel", { ns: "grid" }),
    columnMenuShowColumns: t("columnMenuShowColumns", { ns: "grid" }),
    columnMenuFilter: t("columnMenuFilter", { ns: "grid" }),
    columnMenuHideColumn: t("columnMenuHideColumn", { ns: "grid" }),
    columnMenuUnsort: t("columnMenuUnsort", { ns: "grid" }),
    columnMenuSortAsc: t("columnMenuSortAsc", { ns: "grid" }),
    columnMenuSortDesc: t("columnMenuSortDesc", { ns: "grid" }),
    columnHeaderFiltersTooltipActive: (count) =>
      count !== 1
        ? `${count} ${t("sortPlural", { ns: "grid" })}`
        : `${count} ${t("sortSingular", { ns: "grid" })}`,
    columnHeaderFiltersLabel: t("columnHeaderFiltersLabel", { ns: "grid" }),
    columnHeaderSortIconLabel: t("columnHeaderSortIconLabel", { ns: "grid" }),
  };
  const {
    name,
    setName,
    description,
    setDescription,
    users,
    setUsers,
    listUsers,
    setListUsers,
    roles,
    setRoles,
    setListRoles,
    rowEdit,
    setRowEdit,
    setDropdownLoading,
  } = useGroupDialogStore();
  const { setOpen, setLoading } = useMyDialogStore();

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
              {t("refresh_grid", { ns: "group" })}
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
        errorHandling(
          res.data,
          t("error.error", { ns: "common" }),
          t(`error.${res.data.status}`, { ns: "common" })
        );
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
        <MenuItem onClick={editRow} disabled={!canEditGroup}>
          <ListItemIcon>
            <UpdateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {t("button.edit").charAt(0).toUpperCase() +
              t("button.edit").slice(1)}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={deleteRestoreRow} disabled={!canDelResGroup}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {t("button.delete").charAt(0).toUpperCase() +
              t("button.delete").slice(1)}
            /
            {t("button.restore").charAt(0).toUpperCase() +
              t("button.restore").slice(1)}
          </ListItemText>
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
        setName(row.name);
        setDescription(row.description);
        setUsers(userArr);
        setRoles(roleArr);
        setRowEdit(row);
        myDialog(
          true,
          "form",
          t("edit_group", { ns: "group" }),
          <GroupDialog type="edit" />,
          "sm",
          editGroup,
          t("button.update"),
          () => {
            closeDialog();
            clearDialogState();
          },
          t("button.cancel")
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
          `${
            mode === "delete"
              ? t("button.delete").charAt(0).toUpperCase() +
                t("button.delete").slice(1)
              : t("button.restore").charAt(0).toUpperCase() +
                t("button.restore").slice(1)
          } ${t("group", { ns: "group" })}`,
          `${t("delete_restore_message", {
            action:
              mode === "delete" ? t("button.delete") : t("button.restore"),
            target: row.name,
          })}`,
          "xs",
          () => {
            mode === "delete" ? deleteGroup(row) : restoreGroup(row);
          },
          `${mode === "delete" ? t("button.delete") : t("button.restore")}`,
          closeDialog,
          t("button.cancel")
        );
        handleClose();
      }
    });
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const clearDialogState = () => {
    setName("");
    setDescription("");
    setUsers([]);
    setRoles([]);
  };

  const addGroup = () => {
    setLoading(true);
    const param = {
      name: useGroupDialogStore.getState().name,
      description: useGroupDialogStore.getState().description,
      users: useGroupDialogStore.getState().users,
      roles: useGroupDialogStore.getState().roles,
    };
    groupService.addGroup(param).then((res) => {
      setLoading(false);
      if (!res.status) {
        errorHandling(
          res.data,
          t("error.error", { ns: "common" }),
          t(`error.${res.data.status}`, { ns: "common" })
        );
      } else {
        myAlert(
          true,
          t("success"),
          t("add_success", { ns: "group", subject: param.name }),
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
    setLoading(true);
    const param = {
      id: useGroupDialogStore.getState().rowEdit.id,
      name: useGroupDialogStore.getState().name,
      description: useGroupDialogStore.getState().description,
      users: useGroupDialogStore.getState().users,
      roles: useGroupDialogStore.getState().roles,
    };
    groupService.updateGroup(param).then((res) => {
      setLoading(false);
      if (!res.status) {
        errorHandling(
          res.data,
          t("error.error", { ns: "common" }),
          t(`error.${res.data.status}`, { ns: "common" })
        );
      } else {
        myAlert(
          true,
          t("success"),
          t("edit_success", {
            ns: "group",
            subject: useGroupDialogStore.getState().name,
          }),
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
    setLoading(true);
    groupService.deleteGroup(param).then((res) => {
      if (!res.status) {
        errorHandling(
          res.data,
          t("error.error", { ns: "common" }),
          t(`error.${res.data.status}`, { ns: "common" })
        );
      } else {
        myAlert(
          true,
          t("success"),
          t("delete_success", { ns: "group", subject: row.name }),
          "success",
          "bottom",
          "right"
        );
        closeDialog();
        loadGroupList();
      }
      setLoading(false);
    });
  };

  const restoreGroup = (row) => {
    const param = {
      id: row.id,
    };
    setLoading(true);
    groupService.restoreGroup(param).then((res) => {
      if (!res.status) {
        errorHandling(
          res.data,
          t("error.error", { ns: "common" }),
          t(`error.${res.data.status}`, { ns: "common" })
        );
      } else {
        myAlert(
          true,
          t("success"),
          t("restore_success", { ns: "group", subject: row.name }),
          "success",
          "bottom",
          "right"
        );
        closeDialog();
        loadGroupList();
      }
      setLoading(false);
    });
  };

  const reloadSelector = () => {
    setDropdownLoading(true);
    groupService.dropdownList().then((res) => {
      setDropdownLoading(false);
      if (!res.status) {
        errorHandling(res.data);
      } else {
        setListUsers(res.data.data.users);
        setListRoles(res.data.data.roles);
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
            <InputLabel id="select-rpp">{t("rpp", { ns: "group" })}</InputLabel>
            <Select
              labelId="select-rpp"
              value={pageState.pageSize}
              label={t("rpp", { ns: "group" })}
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
            disabled={!canAddGroup}
            onClick={() => {
              myDialog(
                true,
                "form",
                t("add_group", { ns: "group" }),
                <GroupDialog type="add" />,
                "sm",
                addGroup,
                t("button.add"),
                () => {
                  closeDialog();
                  clearDialogState();
                },
                t("button.cancel")
              );
            }}
            variant="contained"
            fullWidth={matchesSm ? true : false}
          >
            <AddIcon />
            {t("add_group", { ns: "group" })}
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 630, width: "100%" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              localeText={gridLocale}
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
