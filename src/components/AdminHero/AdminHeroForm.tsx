import React, { useReducer, useState } from "react";

import FormInput from "../Forms/FormInput";
import FormTextarea from "../Forms/FormTextarea";
import { INSERT_MAIN_PAGE_HEADER } from "../../graphQL/mutations";

import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";

interface Props {
  cb: any;
}

export interface State {
  heroHeadlineText?: string;
  heroSubHeadlineText?: string;
  heroButtonText?: string;
  heroButtonPointer?: string;
  active: boolean;
}

type Action =
  | { type: "heroHeadlineText"; payload: string }
  | { type: "heroSubHeadlineText"; payload: string }
  | { type: "heroButtonText"; payload: string }
  | { type: "heroButtonPointer"; payload: string }
  | { type: "resetForm" };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "heroHeadlineText":
      return { ...state, heroHeadlineText: action.payload };
    case "heroSubHeadlineText":
      return { ...state, heroSubHeadlineText: action.payload };
    case "heroButtonText":
      return { ...state, heroButtonText: action.payload };
    case "heroButtonPointer":
      return { ...state, heroButtonPointer: action.payload };
    case "resetForm":
      return { active: false };
    default:
      return { ...state };
  }
};

const handleSubmit = async (state: State, addHeroInfoCb: any, setSaveTextCb: any) => {
  console.log(state);

  if (
    state.heroButtonPointer === undefined ||
    state.heroButtonText === undefined ||
    state.heroHeadlineText === undefined ||
    state.heroSubHeadlineText === undefined
  ) {
    setSaveTextCb("Please enter all fields");
    return setTimeout(() => setSaveTextCb("Submit"), 2500);
  }

  setSaveTextCb("Saving...");
  await addHeroInfoCb({
    variables: {
      heroHeadlineText: state.heroHeadlineText,
      heroSubHeadlineText: state.heroSubHeadlineText,
      heroButtonText: state.heroButtonText,
      heroButtonPointer: state.heroButtonPointer,
      active: state.active
    }
  });
  window.location.reload();
};

const AdminHeroForm: React.FC<Props> = ({ cb }) => {
  const [state, dispatch] = useReducer(reducer, { active: false });
  const [saveText, setSaveText] = useState<string>("Submit");

  const [addHeroInfo] = useMutation(INSERT_MAIN_PAGE_HEADER);
  return (
    <>
      <FormInput title="Hero Headline Text" cb={dispatch} action="heroHeadlineText" type="text" />
      <FormTextarea title="Hero Sub-Headline Text" rows={5} cb={dispatch} action="heroSubHeadlineText" />
      <FormInput title="Hero Button Text" cb={dispatch} action="heroButtonText" type="text" />
      <FormInput title="Hero Button Pointer (eg. /classes/SaFE)" cb={dispatch} action="heroButtonPointer" type="text" />
      <Button
        title="submit"
        className={`mt-3 ${saveText === "Please enter all fields" ? "btn-danger" : "btn-primary"}`}
        onClick={() => {
          // console.log(state);
          // addHeroInfo({
          //   variables: {
          //     heroHeadlineText: state.heroHeadlineText,
          //     heroSubHeadlineText: state.heroSubHeadlineText,
          //     heroButtonText: state.heroButtonText,
          //     heroButtonPointer: state.heroButtonPointer,
          //     active: state.active
          //   }
          // });
          // setSaveText("Saving...");
          // setTimeout(() => {
          //   window.location.reload();
          // }, 2000);
          handleSubmit(state, addHeroInfo, setSaveText);
        }}
      >
        {saveText}
      </Button>
      <Button
        className="mt-3 ml-2 btn-warning"
        onClick={() => {
          dispatch({ type: "resetForm" });
          cb();
        }}
      >
        Cancel
      </Button>
    </>
  );
};

export default AdminHeroForm;