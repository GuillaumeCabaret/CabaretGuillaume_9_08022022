/**
* @jest-environment jsdom
*/

import userEvent from "@testing-library/user-event";
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import { localStorageMock } from "../__mocks__/localStorage.js";
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js";
import mockedstore from "../__mocks__/store";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockedstore);

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        test("Then handleSubmit is called", () => {
            const mock = jest.fn();
            const mySpy = jest.spyOn(NewBill.prototype, "handleSubmit").mockImplementation(mock);
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });

            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                    email: "test@test.com",
                })
            );
            const html = NewBillUI();
            document.body.innerHTML = html;

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }

            new NewBill({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage,
            });

            const form = document.querySelector(`form[data-testid="form-new-bill"`);
            expect(form).toBeTruthy();
            fireEvent.submit(form);
            expect(mock).toHaveBeenCalledTimes(1);
            mySpy.mockRestore();
        });
    })
    describe("When i click on submit", () => {
        test("Then a new bill should be created", () => {
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        });
        window.localStorage.setItem(
            "user",
            JSON.stringify({
                type: "Employee",
                email: "employee@test.com",
            })
        );
        const mock = jest.fn();
        const mySpy = jest.spyOn(NewBill.prototype, "updateBill").mockImplementation(mock);

        const html = NewBillUI();
        document.body.innerHTML = html;

        const newBillUI = new NewBill({
            document,
            onNavigate: () => {},
            store: null,
            localStorage: window.localStorage,

        });
        newBillUI.fileUrl = "https://www.test.test";
        newBillUI.fileName = "test.test";

        const et = screen.getByTestId("expense-type");
        et.value = "Transports";

        const en = screen.getByTestId("expense-name");
        en.value = "test bill";

        const amount = screen.getByTestId("amount");
        amount.value = "100";

        const date = screen.getByTestId("datepicker");
        date.value = "2021-06-07";

        const vat = screen.getByTestId("vat");
        vat.value = "";

        const pvt = screen.getByTestId("pct");
        pvt.value = "20";

        const commentary = screen.getByTestId("commentary");
        commentary.value = "test commentary";

        const form = document.querySelector(`form[data-testid="form-new-bill"`);

        const customEvent = {
            preventDefault: jest.fn(),
            target: form,
        };
        newBillUI.handleSubmit(customEvent);
        expect(mock).toHaveBeenCalledTimes(1);
        expect(mock).toHaveBeenCalledWith({
            amount: 100,
            commentary: "test commentary",
            date: "2021-06-07",
            email: "employee@test.com",
            fileName: "test.test",
            fileUrl: "https://www.test.test",
            name: "test bill",
            pct: 20,
            status: "pending",
            type: "Transports",
            vat: "",
        });
        mySpy.mockRestore();
    });

    describe("When i select a file", () => {
        test("then handleChangeFile is called", () => {
            //PREPARATION 
            const mock = jest.fn();
            const file = new File(['hello'], 'hello.png', { type: 'image/png' });

            const mySpy = jest.spyOn(NewBill.prototype, "handleChangeFile").mockImplementation(mock);
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });

            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                    email: "e@e"
                })

            );

            const html = NewBillUI();
            document.body.innerHTML = html;

            new NewBill({
                document,
                onNavigate: () => {},
                store: null,
                localStorage: window.localStorage,
            });

            const fileInput = document.querySelector(`input[data-testid="file"]`);
            
            expect(fileInput).toBeTruthy();
            userEvent.upload(fileInput, file)
            
            expect(mock).toHaveBeenCalledTimes(1);
            mySpy.mockRestore();
        })
    })
    describe("When I select a file", () => {
        test("It should check if the file type have bad extension", () => {
          const mock = jest.fn();
          const mySpy = jest.spyOn(NewBill.prototype, "handleChangeFile").mockImplementation(mock);
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                    email: "e@e"
                })

            );
            document.body.innerHTML = NewBillUI();
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            const myNewBill = new NewBill({
                document,
                onNavigate,
                store:mockedstore,
                localStorage: null
            });

            const badFile = new File(['hello'], 'hello.pdf', { type: 'image/pdf' });
            const customEvent = {
                    preventDefault: jest.fn(),
                    target: {
                        files: [badFile],
                        value: 'hello.pdf'
                    }
                }
            myNewBill.handleChangeFile(customEvent);
            expect(mockedstore.bills().create).toHaveBeenCalledTimes(0);
            mySpy.mockRestore();
        })
    })
    describe("When I select a file", () => {
        test("It should check if the file type have good extension", () => {
          const mock = jest.fn();
          const mySpy = jest.spyOn(NewBill.prototype, "handleChangeFile").mockImplementation(mock);
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                    email: "e@e"
                })

            );
            document.body.innerHTML = NewBillUI();
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            const myNewBill = new NewBill({
                document,
                onNavigate,
                store:mockedstore,
                localStorage: null
            });

            const goodFile = new File(['hello'], 'hello.png', { type: 'image/png' });
            const customEvent = {
                    preventDefault: jest.fn(),
                    target: {
                        files: [goodFile],
                        value: 'hello.png'
                    }
                }
            myNewBill.handleChangeFile(customEvent);
            mySpy.mockRestore();
        })
    })
    describe("When I navigate to Bills page", () => {
        test("fetches bills from mock API GET", async () => {
            // arrange
            localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "e@e" }));
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.innerHTML = "";
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.NewBill)

            const fileInput = screen.getByTestId("file");
            expect(fileInput).toBeTruthy();

      const mockFile = new File(["test.jpg"], "test.jpg", {
        type: "image/jpeg",
      });
      fireEvent.change(fileInput, {
        target: {
          files: [mockFile],
        },
      });
            //assert 
            await new Promise(process.nextTick);
            expect(mockedstore.bills().create).toHaveBeenCalledTimes(1);
        })       
    })
})

test("Click Post 404", async () => {
  jest.spyOn(mockedstore, "bills");

  mockedstore.bills.mockImplementationOnce(() => {
    return {
      create: () => {
        return Promise.reject(new Error("Erreur 404"));
      },
    };
  });

  document.body.innerHTML = "";
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });

  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Employee",
      email: "test@test.com",
    })
  );

  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.append(root);
  router();
  window.onNavigate(ROUTES_PATH.NewBill);

  await waitFor(() => screen.getByText(/Envoyer une note de frais/));
  const fileInput = screen.getByTestId("file");
  expect(fileInput).toBeTruthy();

  // act

  const mockFile = new File(["test.jpg"], "test.jpg", {
    type: "image/jpeg",
  });
  fireEvent.change(fileInput, {
    target: {
      files: [mockFile],
    },
  });

  await new Promise(process.nextTick);

  // assert

  await waitFor(() => screen.getByText(/Erreur 404/));
});


test("Error 500", async () => {
    jest.spyOn(mockedstore, "bills");
    Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
    mockedstore.bills.mockImplementationOnce(() => {
      return {
        create: () => {
          return Promise.reject(new Error("Erreur 500"));
        },
      };
    });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "e@e",
      })
    );
    document.body.innerHTML = "";
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
  
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "test@test.com",
      })
    );
  
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
    window.onNavigate(ROUTES_PATH.NewBill);

    await waitFor(() => screen.getByText(/Envoyer une note de frais/));
    const fileInput = screen.getByTestId("file");
    expect(fileInput).toBeTruthy();

    // act

    const mockFile = new File(["test.jpg"], "test.jpg", {
      type: "image/jpeg",
    });
    fireEvent.change(fileInput, {
      target: {
        files: [mockFile],
      },
    });

    await new Promise(process.nextTick);

    // assert

    await waitFor(() => screen.getByText(/Erreur 500/));
  });

  
