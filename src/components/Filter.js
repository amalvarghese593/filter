import React from "react";
import { useGetFilterParams } from "../hooks/useGetFilterParams";
import { transformValue } from "../utils/transformValue";

export const Filter = ({ filtersWithComponent, persons }) => {
  const getPerson = (id) => persons.find((el) => el.id === id).name;

  const { addFilter, isDisabled, FilterCard } = useGetFilterParams(
    filtersWithComponent,
    FilterComponent,
    {
      createdBy: (id) => getPerson(id),
    }
  );

  return (
    <div>
      <h2>Apply filters</h2>
      <label htmlFor="jobId">Job id</label>
      <select
        disabled={isDisabled("jobId")}
        name="jobId"
        id="jobId"
        onChange={addFilter("number", "jobId")}
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
        onChange={addFilter("string", "jobType")}
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
        onChange={addFilter("string", "name")}
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
      <section>
        <FilterCard />
      </section>
    </div>
  );
};

const FilterComponent = ({ val, type, getValue }) => (
  <span style={{ border: "1px solid red" }}>
    {getValue(transformValue(val, type))}
  </span>
);
