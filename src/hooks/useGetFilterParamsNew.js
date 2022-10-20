import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const useGetFilterParamsNew = (
  filtersWithComponent,
  Component,
  getLabelProps
) => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let persistedFilters = [];
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
    searchParams.delete(name);
    navigate({
      search: searchParams.toString(),
    });
    // setFilters(arr);
  };

  const addFilter = (
    e,
    type,
    name,
    getLabel = (o) => o,
    isComponent = false,
    getValue,
    passedValue
  ) => /* (e) => */ {
    // console.log("e.tgt.vl: ", e?.target.value);
    console.log({ passedValue });
    const val = e?.target.value || passedValue;
    console.log("name: ", { name, type, getLabel, isComponent, getValue });
    const filterObj = {
      filterType: type,
      name,
      value: val,
      getLabel,
    };
    searchParams.set(name, val);
    navigate({
      search: searchParams.toString(),
    });
    if (isComponent) {
      filterObj.Component = (
        <Component val={val} type={type} getValue={getValue} />
      );
    }
    // setFilters((prev) => [...prev, filterObj]);
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
      // const hasComponent = filter.Component;
      // const hasComponent = filter.hasOwnProperty("Component");
      return (
        <div data-testid="filter" key={idx}>
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

  return { addFilter, removeFilter, isDisabled, FilterCard, filters };
};

export { useGetFilterParamsNew };
