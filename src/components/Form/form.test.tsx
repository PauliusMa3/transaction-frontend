import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { IOptionItem } from "features/Transaction";
import Form, { typeErrorMessages } from "./index";

const mockFormSubmit = jest.fn((formData: any) => {
  return Promise.resolve(formData);
});

const mockCurrencyList: IOptionItem[] = [
  {
    value: "EUR",
    label: "EUR"
  },
  {
    value: "USD",
    label: "USD"
  }
];

const mockTransaction = {
  client_id: 35,
  amount: "100.98",
  date: "2021-08-07",
  currency: "USD"
};

describe("App", () => {
  beforeEach(() => {
    render(
      <Form
        onSubmit={mockFormSubmit}
        currencyList={mockCurrencyList}
        status={"resolved"}
        error={null}
      />
    );
  });

  it("should display required errors when all inputs empty", async () => {
    fireEvent.submit(screen.getByRole("button"));

    expect(await screen.findAllByRole("alert")).toHaveLength(3);
    expect(mockFormSubmit).not.toBeCalled();
  });

  it("should display 0 errors and trigger onSubmit function", async () => {
    fireEvent.input(screen.getByLabelText("Client Id"), {
      target: {
        value: mockTransaction.client_id
      }
    });

    fireEvent.input(screen.getByLabelText("Amount"), {
      target: {
        value: mockTransaction.amount
      }
    });

    fireEvent.input(screen.getByLabelText("Date"), {
      target: {
        value: mockTransaction.date
      }
    });
    fireEvent.keyDown(screen.getByText("Select..."), {
      key: "ArrowDown"
    });
    await screen.findByText("USD");
    fireEvent.click(screen.getByText("USD"));
    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
    expect(mockFormSubmit).toBeCalledWith(mockTransaction);
  });

  it("it should display date error when invalid date is entered", async () => {
    fireEvent.input(screen.getByLabelText("Client Id"), {
      target: {
        value: mockTransaction.client_id
      }
    });

    fireEvent.input(screen.getByLabelText("Amount"), {
      target: {
        value: mockTransaction.amount
      }
    });

    fireEvent.input(screen.getByLabelText("Date"), {
      target: {
        value: "Invalid Date"
      }
    });
    fireEvent.keyDown(screen.getByText("Select..."), {
      key: "ArrowDown"
    });
    await screen.findByText("USD");
    fireEvent.click(screen.getByText("USD"));
    fireEvent.submit(screen.getByRole("button"));

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(mockFormSubmit).not.toBeCalled();
    expect(screen.getByText(typeErrorMessages.invalidDate)).toBeInTheDocument();
  });

  it("it should display number error when invalid amount is entered", async () => {
    fireEvent.input(screen.getByLabelText("Client Id"), {
      target: {
        value: mockTransaction.client_id
      }
    });

    fireEvent.input(screen.getByLabelText("Amount"), {
      target: {
        value: "100.89$"
      }
    });

    fireEvent.input(screen.getByLabelText("Date"), {
      target: {
        value: mockTransaction.date
      }
    });
    fireEvent.keyDown(screen.getByText("Select..."), {
      key: "ArrowDown"
    });
    await screen.findByText("USD");
    fireEvent.click(screen.getByText("USD"));
    fireEvent.submit(screen.getByRole("button"));

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(mockFormSubmit).not.toBeCalled();
    expect(
      screen.getByText(typeErrorMessages.invalidNumber)
    ).toBeInTheDocument();
  });

  it("it should display number error when invalid client Id is entered", async () => {
    fireEvent.input(screen.getByLabelText("Client Id"), {
      target: {
        value: "client-42"
      }
    });

    fireEvent.input(screen.getByLabelText("Amount"), {
      target: {
        value: mockTransaction.amount
      }
    });

    fireEvent.input(screen.getByLabelText("Date"), {
      target: {
        value: mockTransaction.date
      }
    });
    fireEvent.keyDown(screen.getByText("Select..."), {
      key: "ArrowDown"
    });
    await screen.findByText("USD");
    fireEvent.click(screen.getByText("USD"));
    fireEvent.submit(screen.getByRole("button"));

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(mockFormSubmit).not.toBeCalled();
    expect(
      screen.getByText(typeErrorMessages.invalidNumber)
    ).toBeInTheDocument();
  });
});
