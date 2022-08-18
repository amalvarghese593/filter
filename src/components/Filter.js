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
        // getLabel: param === "createdBy" ? (id) => getPerson(id) : (o) => o,
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

  return { filters, setFilters };
};

const transformValue = (val, type) => {
  if (type === "boolean") {
    return val === "true" ? true : false;
  } else if (type === "object") {
    return JSON.parse(val);
    // return JSON.parse(JSON.stringify(val));
  } else return val;
};
// const isDisabled = (name, filters) => {
//   const index = filters.findIndex((el) => el.name === name);
//   console.log(name, index);
//   return index === -1 ? false : true;
// };
export const Filter = ({ filtersWithComponent, persons }) => {
  const [searchParams] = useSearchParams();
  // const [filters, setFilters] = useState([]);
  const getPerson = (id) => persons.find((el) => el.id === id).name;
  const { filters, setFilters } = useGetFilterParams(
    filtersWithComponent,
    FilterComponent,
    { createdBy: (id) => getPerson(id) }
  );
  useEffect(() => {
    console.log("currentParams: ", Object.fromEntries([...searchParams]));
    // let persistedFilters = [];
    // let entries = Object.fromEntries([...searchParams]);
    // Object.keys(entries).forEach((entry) => {
    //   const hasEntry = filtersWithComponent.findIndex((el) => el.name === entry) !== -1;
    //   persistedFilters.push({
    //     // filterType:"",
    //     name: entry,
    //     value: searchParams.get(entry),
    //     Component: hasEntry ? <FilterComponent val={} entry /> : undefined,
    //   });
    // });
    // for (const [param, val] of searchParams) {
    //   const hasComp = filtersWithComponent.hasOwnProperty(param);
    //   persistedFilters.push({
    //     filterType: hasComp ? filtersWithComponent[param].type : "string",
    //     name: param,
    //     value: val,
    //     getLabel: param === "createdBy" ? (id) => getPerson(id) : (o) => o,
    //     Component: hasComp ? (
    //       <FilterComponent
    //         val={val}
    //         type={filtersWithComponent[param].type}
    //         getValue={filtersWithComponent[param].getValue}
    //       />
    //     ) : undefined,
    //   });
    // }
    // setFilters(persistedFilters);
    // console.log("persistedFilters: ", persistedFilters);
  }, [searchParams]);
  // useEffect(() => {
  //   setFilters(persistedFilters);
  // }, [persistedFilters]);

  const addFilter =
    (type, name, getLabel = (o) => o, isComponent = false, getValue) =>
    (e) => {
      // console.log({ getLabel });
      const val = e.target.value;
      const filterObj = {
        filterType: type,
        name,
        value: val,
        getLabel,
      };
      if (isComponent) {
        filterObj.Component = (
          <FilterComponent val={val} type={type} getValue={getValue} />
        );
      }
      setFilters((prev) => [...prev, filterObj]);
    };
  const removeFilter = (name) => {
    const index = filters.findIndex((el) => el.name === name);
    let arr = [...filters];
    arr.splice(index, 1);
    setFilters(arr);
  };
  const isDisabled = useCallback(
    (name) => {
      const index = filters.findIndex((el) => el.name === name);
      return index === -1 ? false : true;
    },
    [filters]
  );

  return (
    <div>
      <h2>Apply filters</h2>
      <label htmlFor="jobId">Job id</label>
      <select
        disabled={isDisabled("jobId")}
        name="jobId"
        id="jobId"
        onChange={addFilter("number", "jobId", undefined)}
      >
        <option value={123}>123</option>
        <option value={244}>244</option>
        <option value={981}>981</option>
      </select>
      <label htmlFor="jobType">Job type</label>
      <select
        disabled={isDisabled("jobType")}
        name="jobType"
        id="jobType"
        onChange={addFilter("string", "jobType", undefined)}
      >
        <option value="contract">contract</option>
        <option value="full_time">full time</option>
        <option value="part_time">part time</option>
      </select>
      <label htmlFor="name">Name</label>
      <select
        disabled={isDisabled("name")}
        name="name"
        id="name"
        onChange={addFilter("string", "name", undefined)}
      >
        <option value="john">john</option>
        <option value="max">max</option>
        <option value="bob">bob</option>
      </select>
      <label htmlFor="active">Status</label>
      <select
        disabled={isDisabled("active")}
        name="active"
        id="active"
        onChange={addFilter("boolean", "active", undefined, true, (val) =>
          val ? "active" : "inactive"
        )}
      >
        <option value={true}>active</option>
        <option value={false}>inactive</option>
      </select>
      <label htmlFor="createdBy">Created By</label>
      <select
        disabled={isDisabled("createdBy")}
        name="createdBy"
        id="createdBy"
        onChange={addFilter("string", "createdBy", (id) => getPerson(id))}
      >
        <option value={"123"}>{getPerson("123")}</option>
        <option value={"456"}>{getPerson("456")}</option>
        <option value={"789"}>{getPerson("789")}</option>
      </select>
      {/* <label htmlFor="createdBy">Created By</label>
      <select
        // value={currentParams.createdBy}
        disabled={isDisabled("createdBy")}
        name="createdBy"
        id="createdBy"
        onChange={addFilter("object", "createdBy", true, (o) => o.name)}
      >
        <option value={JSON.stringify({ id: "123", name: "jane" })}>
          Jane
        </option>
        <option value={JSON.stringify({ id: "986", name: "Mary" })}>
          Mary
        </option>
      </select> */}
      <section>
        {filters.map((filter, idx) => {
          const hasComponent = !!filter.Component;
          // const hasComponent = filter.hasOwnProperty("Component");
          return hasComponent ? (
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
          );
        })}
      </section>
    </div>
  );
};

const FilterComponent = ({ val, type, getValue }) => (
  <span style={{ border: "1px solid red" }}>
    {getValue(transformValue(val, type))}
  </span>
);
