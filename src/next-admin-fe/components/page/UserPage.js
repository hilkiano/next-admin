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
import Chip from "@mui/material/Chip";
import { useTranslation } from "next-i18next";

import { userService } from "../../services/userService";
import { myAlert, errorHandling } from "../reusable/MyAlert";
import { myDialog, MyDialog, useMyDialogStore } from "../reusable/MyDialog";
import { UserDialog, useUserDialogStore } from "../dialog/UserDialog";
import { useAuthStore } from "../store/AuthStore";

import AddIcon from "@mui/icons-material/Add";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";

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
      mt: ".4em",
      mb: ".4em",
    },
    children: getInitial(name),
  };
};

const imgAvatar = (name, url) => {
  return {
    sx: {
      width: "40px",
      height: "40px",
      mt: ".4em",
      mb: ".4em",
    },
    src: url,
    alt: name,
  };
};

const MyAvatar = (name, imgUrl) => {
  if (imgUrl) {
    return <Avatar {...imgAvatar(name, imgUrl)} />;
  } else {
    return <Avatar {...stringAvatar(name)} />;
  }
};

export const UserPage = () => {
  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = useState();
  const [contextMenu, setContextMenu] = useState(null);
  const auth = useAuthStore.getState().user;
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

  const columns = [
    {
      field: "id",
      headerName: t("id", { ns: "user" }),
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
      field: "avatar",
      headerName: t("avatar", { ns: "user" }),
      width: 80,
      editable: false,
      renderCell: (v) => {
        return MyAvatar(
          v.row.name,
          v.row.avatar_url
            ? `${process.env.NEXT_PUBLIC_BE_HOST}/${v.row.avatar_url}`
            : null
        );
      },
      align: "center",
      sortable: false,
      filterable: false,
    },
    {
      field: "username",
      headerName: t("username"),
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
      headerName: t("name"),
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
      headerName: t("email", { ns: "user" }),
      minWidth: 200,
      filterOperators: getGridStringOperators().filter(
        (operator) =>
          operator.value === "contains" ||
          operator.value === "equals" ||
          operator.value === "startsWith" ||
          operator.value === "endsWith"
      ),
    },
    {
      field: "groups",
      headerName: t("group"),
      minWidth: 300,
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (v) => {
        if (v.row.groups.length > 0) {
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
              {v.row.groups.slice(0, 3).map((group) => {
                return (
                  <Chip
                    key={group.group.id}
                    icon={<GroupIcon />}
                    sx={{ mr: ".5em", mb: ".5em" }}
                    label={group.group.name}
                    variant="outlined"
                  />
                );
              })}
              {v.row.groups.length > 3 ? (
                <Chip
                  sx={{ mr: ".5em", mb: ".5em" }}
                  label={`${v.row.groups.length - 3} +`}
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
              {t("refresh_grid", { ns: "user" })}
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
        <MenuItem onClick={editRow}>
          <ListItemIcon>
            <UpdateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {t("button.edit").charAt(0).toUpperCase() +
              t("button.edit").slice(1)}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={deleteRestoreRow}>
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
        useUserDialogStore.setState((state) => {
          state.setUsername(row.username);
          state.setName(row.name);
          state.setEmail(row.email);
          state.setRowEdit(row);
        });
        myDialog(
          true,
          "form",
          t("edit_user", { ns: "user" }),
          <UserDialog type="edit" />,
          "sm",
          editUser,
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
        if (selectedRow === auth.id) {
          myAlert(
            true,
            t("error.warning"),
            t("warning_user_delete_message", { target: row.username }),
            "warning",
            "bottom",
            "right"
          );
        } else {
          myDialog(
            true,
            "confirm",
            `${
              mode === "delete"
                ? t("button.delete").charAt(0).toUpperCase() +
                  t("button.delete").slice(1)
                : t("button.restore").charAt(0).toUpperCase() +
                  t("button.restore").slice(1)
            } ${t("user", { ns: "user" })}`,
            `${t("delete_restore_message", {
              action:
                mode === "delete" ? t("button.delete") : t("button.restore"),
              target: row.username,
            })}`,
            "xs",
            () => {
              mode === "delete" ? deleteUser(row) : restoreUser(row);
            },
            `${mode === "delete" ? t("button.delete") : t("button.restore")}`,
            closeDialog,
            t("button.cancel")
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
        errorHandling(
          res.data,
          t("error.error", { ns: "common" }),
          t(`error.${res.data.status}`, { ns: "common" })
        );
      } else {
        myAlert(
          true,
          t("success"),
          t("add_success", { ns: "user", subject: param.username }),
          "success",
          "bottom",
          "right"
        );
        closeDialog();
        clearDialogState();
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
            ns: "user",
            subject: useUserDialogStore.getState().username,
          }),
          "success",
          "bottom",
          "right"
        );
        closeDialog();
        clearDialogState();
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
        errorHandling(
          res.data,
          t("error.error", { ns: "common" }),
          t(`error.${res.data.status}`, { ns: "common" })
        );
      } else {
        myAlert(
          true,
          t("success"),
          t("delete_success", { ns: "user", subject: row.username }),
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
        errorHandling(
          res.data,
          t("error.error", { ns: "common" }),
          t(`error.${res.data.status}`, { ns: "common" })
        );
      } else {
        myAlert(
          true,
          t("success"),
          t("restore_success", { ns: "user", subject: row.username }),
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
            <InputLabel id="select-rpp">{t("rpp", { ns: "user" })}</InputLabel>
            <Select
              labelId="select-rpp"
              value={pageState.pageSize}
              label={t("rpp", { ns: "user" })}
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
                t("add_user", { ns: "user" }),
                <UserDialog type="add" />,
                "sm",
                addUser,
                t("button.add", { ns: "common" }),
                () => {
                  closeDialog();
                  clearDialogState();
                },
                t("button.cancel", { ns: "common" })
              )
            }
            variant="contained"
            fullWidth={matchesSm ? true : false}
          >
            <AddIcon />
            {t("add_user", { ns: "user" })}
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
