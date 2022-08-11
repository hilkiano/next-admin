import React, { useEffect, useCallback } from "react";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import create from "zustand";
import Pagination from "@mui/material/Pagination";

const CustomPagination = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
};

export const useMyGridStore = create((set) => ({
  isLoading: false,
  loadFunc: () => {},
  columns: [],
  data: [],
  total: 0,
  page: 1,
  pageSize: 10,
  sort: "asc",
  field: "id",
  filterField: null,
  filterMode: null,
  filterValue: null,
  contextMenu: null,
  handleContextMenu: () => {},
}));

export const myGrid = (
  isLoading = false,
  loadFunc = () => {},
  columns = [],
  data = [],
  total = 0,
  page = 1,
  pageSize = 10,
  sort = "asc",
  field = "id",
  filterField = null,
  filterMode = null,
  filterValue = null,
  contextMenu = null,
  handleContextMenu = () => {}
) => {
  useMyGridStore.setState({
    isLoading,
    loadFunc,
    columns,
    data,
    total,
    page,
    pageSize,
    sort,
    field,
    filterField,
    filterMode,
    filterValue,
    contextMenu,
    handleContextMenu,
  });
};

export const MyGrid = () => {
  const {
    isLoading,
    loadFunc,
    columns,
    data,
    total,
    page,
    pageSize,
    sort,
    field,
    filterField,
    filterMode,
    filterValue,
    contextMenu,
    handleContextMenu,
  } = useMyGridStore();
  const handleSortChange = useCallback((sortModel) => {
    if (sortModel[0]) {
      useMyGridStore.setState((state) => {
        (state.sort = sortModel[0].sort), (state.field = sortModel[0].field);
      });
    } else {
      useMyGridStore.setState((state) => {
        (state.sort = "asc"), (state.field = "id");
      });
    }
  }, []);

  const handleFilterChange = useCallback((filterModel) => {
    if (filterModel.items[0]) {
      useMyGridStore.setState((state) => {
        (state.filterField = filterModel.items[0].columnField),
          (state.filterMode = filterModel.items[0].operatorValue),
          (state.filterValue = filterModel.items[0].value);
      });
    }
  }, []);

  useEffect(() => {
    loadFunc;
  }, [page, pageSize, sort, field, filterField, filterMode, filterValue]);

  return (
    <div style={{ height: 600, width: "100%" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            components={{
              Pagination: CustomPagination,
            }}
            componentsProps={{
              row: {
                onContextMenu: handleContextMenu,
                style: { cursor: "context-menu" },
              },
            }}
            getRowClassName={(param) =>
              param.row.deleted_at ? `row-deleted` : ""
            }
            autoHeight={false}
            rows={data}
            rowCount={total}
            columns={columns}
            getRowId={(row) => row.id}
            page={page - 1}
            pageSize={pageSize}
            onPageChange={(newPage) => {
              useMyGridStore.setState((state) => (state.page = newPage + 1));
            }}
            onPageSizeChange={(newPageSize) =>
              useMyGridStore.setState((state) => (state.pageSize = newPageSize))
            }
            disableSelectionOnClick
            loading={isLoading}
            pagination
            paginationMode="server"
            sortingMode="server"
            onSortModelChange={handleSortChange}
            filterMode="server"
            onFilterModelChange={handleFilterChange}
          />
        </div>
        {contextMenu}
      </div>
    </div>
  );
};
