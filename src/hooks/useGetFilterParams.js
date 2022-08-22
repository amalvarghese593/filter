import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useSearchParams } from "react-router-dom";

const useGetFilterParams = (filtersWithComponent, Component, getLabelProps) => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState([]);

  let persistedFilters = [];
  useEffect(() => {
    for (const [param, val] of searchParams) {
      const hasComp = filtersWithComponent.hasOwnProperty(param);
      persistedFilters.push({
        filterType: hasComp ? filtersWithComponent[param].type : "string",
        name: param,
        value: val,
        getLabel: getLabelProps[param] ? getLabelProps[param] : (o) => o,
        Component: hasComp ? (
          <Component
            val={val}
            type={filtersWithComponent[param].type}
            getValue={filtersWithComponent[param].getValue}
          />
        ) : undefined,
      });
    }
    setFilters(persistedFilters);
  }, [searchParams]);

  const removeFilter = (name) => {
    const index = filters.findIndex((el) => el.name === name);
    let arr = [...filters];
    arr.splice(index, 1);
    setFilters(arr);
  };

  const addFilter =
    (type, name, getLabel = (o) => o, isComponent = false, getValue) =>
    (e) => {
      const val = e.target.value;
      const filterObj = {
        filterType: type,
        name,
        value: val,
        getLabel,
      };
      if (isComponent) {
        filterObj.Component = (
          <Component val={val} type={type} getValue={getValue} />
        );
      }
      setFilters((prev) => [...prev, filterObj]);
    };

  const isDisabled = useCallback(
    (name) => {
      const index = filters.findIndex((el) => el.name === name);
      return index === -1 ? false : true;
    },
    [filters]
  );

  const FilterCard = () =>
    filters.map((filter, idx) => {
      const hasComponent = !!filter.Component;
      return (
        <div data-testid="filter">
          {hasComponent ? (
            <Fragment key={idx}>
              {filter.Component}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => removeFilter(filter.name)}
              >
                &times;
              </span>
            </Fragment>
          ) : (
            <Fragment key={idx}>
              <span style={{ border: "1px solid green" }}>
                {filter.getLabel(filter.value)}
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => removeFilter(filter.name)}
                >
                  &times;
                </span>
              </span>
            </Fragment>
          )}
        </div>
      );
    });

  return { addFilter, isDisabled, FilterCard };
};

export { useGetFilterParams };
