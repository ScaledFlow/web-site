import React, { useEffect, useReducer } from "react";
import { Container, Row, Col } from "react-bootstrap";

import ClassCard from "./ClassCard";

// queries
import {
  GET_IN_PERSON_SAFE_CLASSES,
  GET_ONLINE_SAFE_CLASSES,
  GET_ONLINE_LESS_CLASSES,
  GET_IN_PERSON_LESS_CLASSES
} from "../../graphQL/queries";
import { useQuery } from "@apollo/client";
import { ClassProfile, ClassSchedule, ConsultantProfile } from "../../graphQL/types";

interface Props {
  classType: string;
}

export interface Class {
  class_profile: ClassProfile;
  class_schedule: ClassSchedule;
  consultant_profile: ConsultantProfile;
}

interface State {
  inPersonClasses: Class[];
  inPersonClassesFiltered: Class[];
  isInPersonClassesFiltered: boolean;
  onlineClasses: Class[];
  onlineClassesFiltered: Class[];
  isOnlineClassesFiltered: boolean;
}

type Action =
  | { type: "set_in_person_classes"; payload: Class[] }
  | { type: "set_in_person_classes_filtered"; payload: Class[] }
  | { type: "set_is_in_person_classes_filtered"; payload: boolean }
  | { type: "set_online_classes"; payload: Class[] }
  | { type: "set_online_classes_filtered"; payload: Class[] }
  | { type: "set_is_online_classes_filtered"; payload: boolean };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "set_in_person_classes":
      return { ...state, inPersonClasses: action.payload };
    case "set_in_person_classes_filtered":
      return { ...state, inPersonClassesFiltered: action.payload };
    case "set_is_in_person_classes_filtered":
      return { ...state, isInPersonClassesFiltered: action.payload };
    case "set_online_classes":
      return { ...state, onlineClasses: action.payload };
    case "set_online_classes_filtered":
      return { ...state, onlineClassesFiltered: action.payload };
    case "set_is_online_classes_filtered":
      return { ...state, isOnlineClassesFiltered: action.payload };
  }
};

function toggleFilter(classType: "online" | "in-person", dispatch: any, state: State) {
  // FIXME: Figure out type definition for callback
  if (classType === "online") {
    dispatch({ type: "set_is_online_classes_filtered", payload: !state.isOnlineClassesFiltered });
  }
  if (classType === "in-person") {
    dispatch({ type: "set_is_in_person_classes_filtered", payload: !state.isInPersonClassesFiltered });
  }
}

const NUMBER_OF_CLASSES_TO_DISPLAY = 3;

const ClassList: React.FC<Props> = ({ classType }) => {
  const [state, dispatch] = useReducer(reducer, {
    isInPersonClassesFiltered: true,
    isOnlineClassesFiltered: true
  } as State);

  const { loading: inPersonLoading, error: inPersonError, data: inPersonData } = useQuery(GET_IN_PERSON_SAFE_CLASSES);
  const { loading: onlineLoading, error: onlineError, data: onlineData } = useQuery(GET_ONLINE_SAFE_CLASSES);
  const { loading: inPersonLessLoading, error: inPersonLessError, data: inPersonLessData } = useQuery(
    GET_IN_PERSON_LESS_CLASSES
  );
  const { loading: onlineLessLoading, error: onlineLessError, data: onlineLessData } = useQuery(
    GET_ONLINE_LESS_CLASSES
  );

  // init in person data
  useEffect(() => {
    let temp: any;
    if (classType === "/training/scaled-agile") {
      temp = inPersonData ? inPersonData : [];
    } else {
      temp = inPersonLessData ? inPersonLessData : [];
    }
    dispatch({
      type: "set_in_person_classes",
      payload:
        !inPersonLoading || !inPersonLessLoading || temp !== undefined
          ? temp.consultant_profiles_link_class_profiles_link_class_schedules
          : []
    });
  }, [
    inPersonLoading,
    inPersonError,
    inPersonData,
    inPersonLessLoading,
    inPersonLessError,
    inPersonLessData,
    classType
  ]);
  // init filtered list
  useEffect(() => {
    let temp: Class[];
    if (state.isInPersonClassesFiltered) {
      temp = state.inPersonClasses ? state.inPersonClasses.filter((c, i) => i < NUMBER_OF_CLASSES_TO_DISPLAY) : [];
    } else {
      temp = state.inPersonClasses ? state.inPersonClasses : [];
    }
    dispatch({
      type: "set_in_person_classes_filtered",
      payload: temp
    });
  }, [state.inPersonClasses, state.isInPersonClassesFiltered]);

  // init online data
  useEffect(() => {
    let temp: any;
    if (classType === "/training/scaled-agile") {
      temp = onlineData ? onlineData : [];
    } else {
      temp = onlineLessData ? onlineLessData : [];
    }
    dispatch({
      type: "set_online_classes",
      payload:
        !onlineLoading || !onlineLessLoading || temp !== undefined
          ? temp.consultant_profiles_link_class_profiles_link_class_schedules
          : []
    });
  }, [onlineLoading, onlineError, onlineData, onlineLessLoading, onlineLessError, onlineLessData, classType]);
  // init filtered list
  useEffect(() => {
    let temp: Class[];
    if (state.isOnlineClassesFiltered) {
      temp = state.onlineClasses ? state.onlineClasses.filter((c, i) => i < NUMBER_OF_CLASSES_TO_DISPLAY) : [];
    } else {
      temp = state.onlineClasses ? state.onlineClasses : [];
    }
    dispatch({
      type: "set_online_classes_filtered",
      payload: temp
    });
  }, [state.onlineClasses, state.isOnlineClassesFiltered]);

  return (
    <>
      <Container>
        <Row>
          <Col lg={6}>
            <h4>In Person Classes</h4>
            {!inPersonLoading &&
              state.inPersonClassesFiltered.map((c, i) => (
                <Col md={12} className="class-card" key={i}>
                  <ClassCard classData={c} isOnline={false} isOnlineText="In-Person, Live Instructor-led Class" />
                </Col>
              ))}
            <Row>
              <Col className="text-center">
                <button className="link-styled-button" onClick={() => toggleFilter("in-person", dispatch, state)}>
                  {state.isInPersonClassesFiltered ? "See More In Person Classes" : "See Fewer In Person Classes"}
                </button>
              </Col>
            </Row>
          </Col>
          <Col lg={6}>
            <h4>Online Classes</h4>
            {!onlineLoading &&
              state.onlineClassesFiltered.map((c, i) => (
                <Col md={12} className="class-card" key={i}>
                  <ClassCard classData={c} isOnline={true} isOnlineText="Online, Live Instructor-led Class" />
                </Col>
              ))}
            <Row>
              <Col className="text-center">
                <button className="link-styled-button" onClick={() => toggleFilter("online", dispatch, state)}>
                  {state.isOnlineClassesFiltered ? "See More Online Classes" : "See Fewer Online Classes"}
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ClassList;
