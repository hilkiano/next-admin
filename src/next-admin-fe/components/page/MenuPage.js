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
import Icon from "@mui/material/Icon";
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

import { menuService } from "../../services/menuService";
import { myAlert, errorHandling } from "../reusable/MyAlert";
import { myDialog, MyDialog, useMyDialogStore } from "../reusable/MyDialog";
import { useMenuDialogStore, MenuDialog } from "../dialog/MenuDialog";

import AddIcon from "@mui/icons-material/Add";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
    filterOperators: getGridStringOperators().filter(
      (operator) =>
        operator.value === "contains" ||
        operator.value === "equals" ||
        operator.value === "startsWith" ||
        operator.value === "endsWith"
    ),
  },
  {
    field: "label",
    headerName: "Label",
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
    field: "is_parent",
    headerName: "Parent Menu",
    width: 150,
    type: "boolean",
  },
  {
    field: "parent",
    headerName: "Parent",
    width: 150,
    filterOperators: getGridStringOperators().filter(
      (operator) =>
        operator.value === "contains" ||
        operator.value === "equals" ||
        operator.value === "startsWith" ||
        operator.value === "endsWith"
    ),
    renderCell: (v) => {
      return v.value ? v.value : "-";
    },
  },
  {
    field: "icon",
    headerName: "Icon",
    width: 100,
    filterOperators: getGridStringOperators().filter(
      (operator) =>
        operator.value === "contains" ||
        operator.value === "equals" ||
        operator.value === "startsWith" ||
        operator.value === "endsWith"
    ),
    renderCell: (v) => {
      return <Icon>{v.row.icon}</Icon>;
    },
    align: "center",
    filterable: false,
    sortable: false,
  },
  {
    field: "url",
    headerName: "URL",
    flex: 1,
    minWidth: 200,
    filterOperators: getGridStringOperators().filter(
      (operator) =>
        operator.value === "contains" ||
        operator.value === "equals" ||
        operator.value === "startsWith" ||
        operator.value === "endsWith"
    ),
    renderCell: (v) => {
      return v.value ? <Chip label={v.value} variant="outlined" /> : "-";
    },
  },
];

export const MenuPage = () => {
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
              onClick={loadMenuList}
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
              onClick={loadMenuList}
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

  const loadMenuList = () => {
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
    menuService.menuList(param).then((res) => {
      if (!res.status) {
        setPageState((old) => ({ ...old, isLoading: false }));
        errorHandling(res.data);
      } else {
        const arrParent = [];
        res.data.data.map((menu) => {
          if (menu.is_parent) {
            arrParent.push(menu.name);
          }
        });
        useMenuDialogStore.setState((state) => (state.parents = arrParent));
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
        useMenuDialogStore.setState((state) => {
          state.setName(row.name);
          state.setLabel(row.label);
          state.setIcon(row.icon);
          state.setIsParent(row.is_parent);
          row.parent ? state.setParent(row.parent) : null;
          row.url ? state.setUrl(row.url) : null;
          state.setRowEdit(row);
        });
        myDialog(
          true,
          "form",
          "Edit Menu",
          <MenuDialog type="edit" />,
          "sm",
          editMenu,
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
          `${mode.charAt(0).toUpperCase() + mode.slice(1)} menu`,
          `Are you sure you want to ${mode} menu ${row.name}?`,
          "xs",
          () => {
            mode === "delete" ? deleteMenu(row) : restoreMenu(row);
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
    useMenuDialogStore.setState((state) => {
      state.setName("");
      state.setLabel("");
      state.setUrl("");
      state.setIsParent(false);
      state.setIcon("");
      state.setParent("");
      state.setRowEdit(null);
    });
  };

  const addMenu = () => {
    useMyDialogStore.setState((state) => (state.loading = true));
    const param = {
      name: useMenuDialogStore.getState().name,
      label: useMenuDialogStore.getState().label,
      is_parent: useMenuDialogStore.getState().isParent,
      url: useMenuDialogStore.getState().url,
      icon: useMenuDialogStore.getState().icon,
    };
    if (!useMenuDialogStore.getState().isParent) {
      param["parent"] = useMenuDialogStore.getState().parent;
    }
    menuService.addMenu(param).then((res) => {
      useMyDialogStore.setState((state) => (state.loading = false));
      if (!res.status) {
        errorHandling(res.data);
      } else {
        myAlert(
          true,
          "Success",
          `Menu ${param.name} has been added`,
          "success",
          "bottom",
          "right"
        );
        closeDialog();
        clearDialogState();
        loadMenuList();
      }
    });
  };

  const editMenu = () => {
    useMyDialogStore.setState((state) => (state.loading = true));
    const param = {
      id: useMenuDialogStore.getState().rowEdit.id,
      name: useMenuDialogStore.getState().name,
      label: useMenuDialogStore.getState().label,
      is_parent: useMenuDialogStore.getState().isParent,
      url: useMenuDialogStore.getState().url,
      icon: useMenuDialogStore.getState().icon,
    };
    if (!useMenuDialogStore.getState().isParent) {
      param["parent"] = useMenuDialogStore.getState().parent;
    }
    menuService.updateMenu(param).then((res) => {
      useMyDialogStore.setState((state) => (state.loading = false));
      if (!res.status) {
        errorHandling(res.data);
      } else {
        myAlert(
          true,
          "Success",
          `Menu ${useMenuDialogStore.getState().name} has been edited`,
          "success",
          "bottom",
          "right"
        );
        closeDialog();
        clearDialogState();
        loadMenuList();
      }
    });
  };

  const deleteMenu = (row) => {
    const param = {
      id: row.id,
    };
    useMyDialogStore.setState((state) => (state.loading = true));
    menuService.deleteMenu(param).then((res) => {
      if (!res.status) {
        errorHandling(res.data);
      } else {
        myAlert(
          true,
          "Success",
          `Menu ${row.name} has been deleted`,
          "success",
          "bottom",
          "right"
        );
        closeDialog();
        loadMenuList();
      }
      useMyDialogStore.setState((state) => (state.loading = false));
    });
  };

  const restoreMenu = (row) => {
    const param = {
      id: row.id,
    };
    useMyDialogStore.setState((state) => (state.loading = true));
    menuService.restoreMenu(param).then((res) => {
      if (!res.status) {
        errorHandling(res.data);
      } else {
        myAlert(
          true,
          "Success",
          `Menu ${row.name} has been restored`,
          "success",
          "bottom",
          "right"
        );
        closeDialog();
        loadMenuList();
      }
      useMyDialogStore.setState((state) => (state.loading = false));
    });
  };

  useEffect(() => {
    loadMenuList();
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
                "Add Menu",
                <MenuDialog type="add" />,
                "sm",
                addMenu,
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
            Add Menu
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
