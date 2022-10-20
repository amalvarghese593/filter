import React, { Fragment, useState } from "react";
import { useGetFilterParams } from "../hooks/useGetFilterParams";
import { transformValue } from "../utils/transformValue";
import { TagChipInputNew } from "./TagChipInputNew";

export const FilterNew = ({ filtersWithComponent, persons }) => {
  const getPerson = (id) => persons.find((el) => el.id === id).name;

  const { addFilter, removeFilter, isDisabled, FilterCard, filters } =
    useGetFilterParams(filtersWithComponent, FilterComponent, {
      createdBy: (id) => getPerson(id),
    });

  const [tags, setTags] = useState([]);
  // const [tags, setTags] = useState(["Apple", "Mango", "Orange"]);
  const [error, setError] = useState("required field!");
  const [touched, setTouched] = useState(false);
  const onChange = (itemArray) => {
    console.log("tags from inside: ", itemArray);
    const concatanatedFilter = itemArray.join(",");
    addFilter(
      undefined,
      "string",
      "myFruits",
      undefined,
      undefined,
      undefined,
      concatanatedFilter
    );
  };
  const onBlur = (e) => {
    setTouched(true);
  };
  const onKeyDown = (e) => {};
  const onHandleShow = (e) => {};
  return (
    <div>
      <h2>Apply filters</h2>
      <label htmlFor="jobId">Job id</label>
      <select
        disabled={isDisabled("jobId")}
        name="jobId"
        id="jobId"
        onChange={(e) => addFilter(e, "number", "jobId")}
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
        onChange={(e) => addFilter(e, "string", "jobType")}
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
        onChange={(e) => addFilter(e, "string", "name")}
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
        onChange={(e) =>
          addFilter(e, "boolean", "active", undefined, true, (val) =>
            val ? "active" : "inactive"
          )
        }
      >
        <option value={true}>active</option>
        <option value={false}>inactive</option>
      </select>
      <label htmlFor="createdBy">Created By</label>
      <select
        disabled={isDisabled("createdBy")}
        name="createdBy"
        id="createdBy"
        onChange={(e) =>
          addFilter(e, "string", "createdBy", (id) => getPerson(id))
        }
      >
        <option value={"kjkjkj"}>{getPerson("kjkjkj")}</option>
        <option value={"akjakjks"}>{getPerson("akjakjks")}</option>
        <option value={"aksajsj"}>{getPerson("aksajsj")}</option>
      </select>
      <TagChipInputNew
        error={touched && error}
        value={tags}
        setTags={setTags}
        tagsLimit={6}
        placeholder="Enter fruits"
        isTagsInside
        label="Fruits"
        component={
          {
            // CloseButton: CloseIcon,
          }
        }
        // isDefaultUi
        onBlur={onBlur}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onHandleShow={onHandleShow}
      />
      <section data-testid="filterwrapper">
        {/* <FilterCard /> */}
        {filters.map((filter, idx) => {
          const hasComponent = !!filter.Component;
          return (
            <div data-testid="filter" key={idx}>
              {hasComponent ? (
                <Fragment>
                  {filter.Component}
                  <span onClick={() => removeFilter(filter.name)}>&times;</span>
                </Fragment>
              ) : (
                <span>
                  {filter.getLabel(filter.value)}
                  <span onClick={() => removeFilter(filter.name)}>&times;</span>
                </span>
              )}
            </div>
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
