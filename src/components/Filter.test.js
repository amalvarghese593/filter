import { Filter } from "./Filter";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("/* tests related to  */Filter component", () => {
  test("contains hello world", () => {
    render(<Filter />);
    const component = screen.getByText("amal", { exact: false });
    //   const component = screen.getByText(/amal/i);
    userEvent.selectOptions(screen.getByRole("listbox", ["contract"]));
    const filterWrapper = screen.getByTestId("filterwrapper");
    const filter = screen.getByTestId("filter");
    // expect(component).toBeInTheDocument();
    expect(filterWrapper).toContainElement(filter);
  });
});
