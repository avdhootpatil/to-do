import * as yup from "yup";

const getSchema = () => {
  return yup.object().shape({
    summary: yup.string().required().min(10).max(140),
    description: yup.string().required().min(10).max(500),
    dueDate: yup.string().nullable(),
    priority: yup.string().nullable(),
    createdOn: yup.string().nullable(),
    currentState: yup.string().nullable(),
  });
};

export default getSchema;
