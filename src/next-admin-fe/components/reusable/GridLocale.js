import { useTranslation } from "next-i18next";

export const GridLocale = () => {
  const { t } = useTranslation();

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

  return gridLocale;
};
