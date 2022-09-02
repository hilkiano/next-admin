import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from "@mui/x-data-grid";
import { logService } from "../../services/logService";
import { errorHandling } from "../reusable/MyAlert";
import { UserContext } from "../context/UserContext";
import moment from "moment";
import "moment/locale/id";

export const ActivityLogTable = () => {
  const { user, setUser } = useContext(UserContext);
  const { t } = useTranslation();
  const router = useRouter();
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 5,
    sort: "asc",
    field: "created_at",
    filterField: null,
    filterMode: null,
    filterValue: null,
  });
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
      field: "created_at",
      headerName: t("datetime"),
      width: 200,
      type: "dateTime",
      sortable: false,
      filterable: false,
      renderCell: (v) => {
        return moment(v.row.created_at)
          .locale(router.locale)
          .format("DD MMM YYYY HH:mm:ss");
      },
    },
    {
      field: "log_string",
      headerName: t("activity"),
      width: 400,
      type: "string",
      sortable: false,
      filterable: false,
      renderCell: (v) => {
        return t(v.row.log_string, { ns: "log" });
      },
    },
    {
      field: "status",
      headerName: t("status"),
      minWidth: 100,
      type: "boolean",
      flex: 1,
      sortable: false,
      filterable: false,
    },
  ];

  const loadActivityLog = () => {
    setPageState((old) => ({ ...old, isLoading: true }));
    const param = {
      mode: "top-5",
    };
    logService.list(param).then((res) => {
      setPageState((old) => ({ ...old, isLoading: false }));
      if (!res.status) {
        errorHandling(
          res.data,
          t("error.error", { ns: "common" }),
          t(`error.${res.data.status}`, { ns: "common" })
        );
      } else {
        setPageState((old) => ({
          ...old,
          data: res.data.data,
          total: res.data.total,
        }));
      }
    });
  };

  useEffect(() => {
    loadActivityLog();
  }, []);

  return (
    <div style={{ height: 318, width: "100%" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            localeText={gridLocale}
            sx={{
              height: "100%",
              width: "100%",
            }}
            rows={pageState.data}
            rowCount={pageState.total}
            columns={columns}
            getRowId={(row) => row.id}
            disableSelectionOnClick
            loading={pageState.isLoading}
            rowsPerPageOptions={[5]}
            hideFooter={true}
            autoPageSize={true}
          />
        </div>
      </div>
    </div>
  );
};
