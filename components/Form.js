import React from "react";
import axios from "axios";
import filesize from "filesize";
import { useMediaQuery, useWindowScroll, useForm } from "@mantine/hooks";
import {
  Group,
  Text,
  Container,
  Paper,
  Divider,
  InputWrapper,
  Autocomplete,
  TextInput,
  NumberInput,
  Textarea,
  MultiSelect,
  Badge,
  Button,
  Center,
  Affix,
  Transition,
  LoadingOverlay,
  Input,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useNotifications } from "@mantine/notifications";
import {
  FiMail,
  FiCalendar,
  FiPlus,
  FiFile,
  FiSend,
  FiArrowUp,
  FiCheckCircle,
  FiXCircle,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useRouter } from "next/router";

function Form() {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [scroll, scrollTo] = useWindowScroll();
  const isMobile = useMediaQuery("(max-width: 755px)");
  const notifications = useNotifications();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [referenceLinks, setReferenceLinks] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const dark = colorScheme === "dark";

  const form = useForm({
    initialValues: {
      accountManager: "",
      emailAddress: "",
      clientName: "",
      dateOfProposalSubmission: null,
      estimate: "",
      locationOfProject: "",
      typeOfProject: "",
      eventDate: null,
      eventDuration: "",
      hardwarePurchase: "",
      technicalSupport: "",
      presentation: "",
      presentationType: "",
      presentationTypeOthers: "",
      sow: "",
      referenceLinks: [],
    },
    validationRules: {
      accountManager: (value) => value.length > 0,
      emailAddress: (value) => /^\S+@\S+$/.test(value),
      clientName: (value) => value.length > 0,
      dateOfProposalSubmission: (value) => value !== null,
      estimate: (value) => value.length > 0,
      locationOfProject: (value) => value.length > 0,
      typeOfProject: (value) => value.length > 0,
      eventDate: (eventDate, values) =>
        values.typeOfProject === "Rental/Event" ? eventDate !== null : true,
      eventDuration: (eventDuration, values) =>
        values.typeOfProject === "Rental/Event"
          ? eventDuration.toString().length > 0
          : true,
      hardwarePurchase: (value) => value.length > 0,
      technicalSupport: (value) => value.length > 0,
      presentation: (value) => value.length > 0,
      presentationType: (presentationType, values) =>
        values.presentation === "Yes" ? presentationType.length > 0 : true,
      presentationTypeOthers: (presentationTypeOthers, values) =>
        values.presentationType === "Others"
          ? presentationTypeOthers.length > 0
          : true,
      sow: (value) => value.length > 0,
      referenceLinks: (value) => value.length > 0,
    },
  });

  const handleSubmit = () => {
    console.log("Handle Submit Triggered");
    setLoading(true);
    setError(null);
    const id = notifications.showNotification({
      loading: true,
      title: "Submitting your Form",
      message: "Please wait while we submit your form",
      autoClose: false,
      disallowClose: true,
    });
    const data = new FormData();
    data.append("accountManager", form.values.accountManager);
    data.append("emailAddress", form.values.emailAddress);
    data.append("clientName", form.values.clientName);
    data.append(
      "dateOfProposalSubmission",
      form.values.dateOfProposalSubmission
    );
    data.append("estimate", form.values.estimate);
    data.append("locationOfProject", form.values.locationOfProject);
    data.append("typeOfProject", form.values.typeOfProject);
    data.append("eventDate", form.values.eventDate);
    data.append("eventDuration", form.values.eventDuration);
    data.append("hardwarePurchase", form.values.hardwarePurchase);
    data.append("technicalSupport", form.values.technicalSupport);
    data.append("presentation", form.values.presentation);
    data.append("presentationType", form.values.presentationType);
    data.append("presentationTypeOthers", form.values.presentationTypeOthers);
    data.append("sow", form.values.sow);
    data.append("referenceLinks", form.values.referenceLinks);
    for (let i = 0; i < files.length; i++) {
      data.append("files", files[i]);
    }

    const url = process.env.API_URL + "/sendemail";
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .post(url, data, config)
      .then((res) => {
        notifications.updateNotification(id, {
          id,
          color: "teal",
          title: "Form Submitted",
          message: "Your form has been submitted successfully",
          icon: <FiCheckCircle />,
          autoClose: true,
          disallowClose: false,
        });
        router.reload();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        notifications.updateNotification(id, {
          id,
          color: "red",
          title: "Form Submission Failed",
          message: "Your form submission failed",
          icon: <FiXCircle />,
          autoClose: true,
          disallowClose: false,
        });
        setLoading(false);
        setError(err);
      });
  };

  return (
    <>
      <ActionIcon
        variant="outline"
        color={dark ? "yellow" : "teal"}
        onClick={() => toggleColorScheme()}
        title="Toggle Color Scheme"
        style={{ marginBottom: "1rem" }}
      >
        {dark ? (
          <FiSun style={{ width: 18, height: 18 }} />
        ) : (
          <FiMoon style={{ width: 18, height: 18 }} />
        )}
      </ActionIcon>
      <Container>
        <Paper padding="md" shadow="sm" radius="md">
          <Group direction="column" justify="center" align="center" withGutter>
            <Text size="lg" weight={700} align="center">
              Request for Proposal
            </Text>
            <Text size="xs" align="center">
              Incase of emergencies please contact 00971527590498 or
              aditya.r@takeleap.com
            </Text>
          </Group>
          <Divider />
          <Container size="xs" padding="xs" style={{ marginTop: "10px" }}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <LoadingOverlay visible={loading} />
              <Autocomplete
                id="accountManager"
                label="Account Manager"
                required
                placeholder="Select Account Manager"
                data={[
                  "Sophiya",
                  "Ziad",
                  "Christine",
                  "Sharme",
                  "Aditya",
                  "Other",
                ]}
                onChange={(event) =>
                  form.setFieldValue("accountManager", event)
                }
                error={form.errors.accountManager}
              />
              <InputWrapper id="emailAddress" required label="Email ID">
                <TextInput
                  id="emailAddress"
                  icon={<FiMail />}
                  placeholder="Your email"
                  onChange={(e) =>
                    form.setFieldValue("emailAddress", e.target.value)
                  }
                  error={
                    form.errors.emailAddress &&
                    "Field should contain a valid email"
                  }
                />
              </InputWrapper>
              <InputWrapper id="clientName" required label="Client Name">
                <TextInput
                  id="clientName"
                  placeholder="Client Name"
                  onChange={(e) =>
                    form.setFieldValue("clientName", e.target.value)
                  }
                  error={form.errors.clientName}
                />
              </InputWrapper>
              <DatePicker
                id="dateOfProposalSubmission"
                dropdownType={isMobile ? "modal" : "popover"}
                placeholder="Pick date"
                label="Date of Proposal Submission"
                icon={<FiCalendar />}
                required
                onChange={(event) =>
                  form.setFieldValue("dateOfProposalSubmission", event)
                }
                error={form.errors.dateOfProposalSubmission}
              />
              <Autocomplete
                id="estimate"
                label="Estimate Type"
                required
                placeholder="Select Estimate Type"
                data={["Actual", "Range", "Indicative"]}
                onChange={(event) => form.setFieldValue("estimate", event)}
                error={form.errors.estimate}
              />
              <InputWrapper
                id="locationOfProject"
                required
                label="Venue / Location of the Project"
              >
                <TextInput
                  id="locationOfProject"
                  placeholder="Location of the Project"
                  onChange={(e) =>
                    form.setFieldValue("locationOfProject", e.target.value)
                  }
                  error={form.errors.locationOfProject}
                />
              </InputWrapper>
              <Autocomplete
                id="typeOfProject"
                label="Type of Project"
                required
                placeholder="Type of Project"
                data={[
                  "Permanent",
                  "Rental/Event",
                  "Additional to a previous scope/project",
                ]}
                onChange={(event) => form.setFieldValue("typeOfProject", event)}
                error={form.errors.typeOfProject}
              />
              {form.values.typeOfProject === "Rental/Event" ? (
                <>
                  <DatePicker
                    id="eventDate"
                    dropdownType={isMobile ? "modal" : "popover"}
                    placeholder="Pick event date"
                    label="Event Date"
                    icon={<FiCalendar />}
                    required
                    onChange={(event) => form.setFieldValue("eventDate", event)}
                    error={form.errors.eventDate}
                  />
                  <NumberInput
                    defaultValue={1}
                    placeholder="Event Duration"
                    description="in days"
                    label="Event Duration"
                    required
                    min={1}
                    onChange={(event) =>
                      form.setFieldValue("eventDuration", event)
                    }
                    error={form.errors.eventDuration}
                  />
                </>
              ) : null}
              <Autocomplete
                id="hardwarePurchase"
                label="Hardware Requirement"
                required
                placeholder="Hardware Requirement"
                data={["Purchase", "Rental", "No Hardware Required"]}
                onChange={(event) =>
                  form.setFieldValue("hardwarePurchase", event)
                }
                error={form.errors.hardwarePurchase}
              />
              <Autocomplete
                id="technicalSupport"
                label="Technical Support"
                required
                placeholder="Technical Support"
                data={["Required", "Not required"]}
                onChange={(event) =>
                  form.setFieldValue("technicalSupport", event)
                }
                error={form.errors.technicalSupport}
              />
              <Autocomplete
                id="presentation"
                label="Presentation Required"
                required
                placeholder="Presentation Required"
                data={["Yes", "No"]}
                onChange={(event) => form.setFieldValue("presentation", event)}
                error={form.errors.presentation}
              />
              {form.values.presentation === "Yes" ? (
                <Autocomplete
                  id="presentationType"
                  label="Presentation Type"
                  required
                  placeholder="Presentation Type"
                  data={[
                    "Techincal Presentation",
                    "Design Presentation",
                    "UI Flow",
                    "Others",
                  ]}
                  onChange={(event) =>
                    form.setFieldValue("presentationType", event)
                  }
                  error={form.errors.presentationType}
                />
              ) : null}
              {form.values.presentationType === "Others" ? (
                <InputWrapper
                  id="presentationTypeOthers"
                  required
                  label="Enter Presentation Type"
                >
                  <TextInput
                    placeholder="Enter Presentation Type"
                    onChange={(e) =>
                      form.setFieldValue(
                        "presentationTypeOthers",
                        e.target.value
                      )
                    }
                    error={form.errors.presentationTypeOthers}
                  />
                </InputWrapper>
              ) : null}
              <Textarea
                placeholder="Scope Of Work"
                label="Scope Of Work"
                description="The scope of work needs to be detailed for better pricing and shorter turn around time. Please write down the steps of the experience."
                autosize="true"
                required
                onChange={(event) =>
                  form.setFieldValue("sow", event.currentTarget.value)
                }
                error={form.errors.scopeOfWork}
              />
              <MultiSelect
                style={{ marginBottom: "10px" }}
                label="Reference Links"
                data={referenceLinks}
                placeholder="Reference Links"
                rightSection={<FiPlus />}
                searchable
                creatable
                getCreateLabel={(query) => `+ Add ${query}`}
                onCreate={(query) =>
                  setReferenceLinks((current) => [...current, query])
                }
                onChange={(event) =>
                  form.setFieldValue("referenceLinks", event)
                }
                error={form.errors.referenceLinks}
              />
              {files.length > 0 ? (
                <Badge
                  style={{
                    float: "right",
                    position: "relative",
                    zIndex: "1",
                    marginTop: "5px",
                    marginRight: "5px",
                  }}
                  color="red"
                  onClick={() => {
                    setFiles([]);
                  }}
                >
                  Clear
                </Badge>
              ) : null}
              <InputWrapper id="files" required label="Files">
                <Input
                  type="file"
                  multiple={true}
                  onChange={(event) => {
                    setFiles(event.target.files);
                  }}
                />
                {files.length > 0
                  ? Object.values(files).map((file) => (
                      <div key={file.name}>
                        <Badge>
                          <FiFile />
                          {file.name}({filesize(file.size)})
                        </Badge>
                      </div>
                    ))
                  : null}
              </InputWrapper>
              <Center style={{ marginTop: 10 }}>
                <Button
                  type="submit"
                  leftIcon={<FiSend />}
                  variant="outline"
                  uppercase
                  loading={loading}
                  loaderPosition="right"
                >
                  Submit
                </Button>
              </Center>
            </form>
          </Container>
        </Paper>
        <Affix position={{ bottom: 20, right: 20 }}>
          <Transition transition="slide-up" mounted={scroll.y > 0}>
            {(transitionStyles) => (
              <Button
                leftIcon={<FiArrowUp />}
                style={transitionStyles}
                onClick={() => scrollTo({ y: 0 })}
              >
                Scroll to top
              </Button>
            )}
          </Transition>
        </Affix>
      </Container>
    </>
  );
}

export default Form;
