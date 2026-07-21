import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(3, "Name is too short"),
  phone: yup
    .string()
    .required("Contact is required")
    .matches(/^\d{4}-\d{7}$/, "Format: 03xx-xxxxxxx"),
  gender: yup
    .string()
    .oneOf(["male", "female", "other"])
    .required("Gender is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .positive()
    .integer()
    .min(5, "Minimum age is 5")
    .required("Age is required"),
  cnic: yup.string().when("age", ([age], schema) => {
    if (Number(age) >= 18) {
      return schema
        .required("CNIC is required for members aged 18+")
        .matches(/^\d{5}-\d{7}-\d$/, "Format: 12345-1234567-1");
    }
    return schema.optional().nullable();
  }),
  address: yup.string().optional(),
  admissionFees: yup
    .number()
    .typeError("Must be a number")
    .min(0)
    .nullable()
    .transform((v, orig) => (orig === "" ? null : v)),
  fees: yup
    .number()
    .typeError("Must be a number")
    .positive()
    .required("Monthly fees are required"),
  feesAfterDiscount: yup
    .number()
    .typeError("Must be a number")
    .min(0)
    .required("Fees after discount are required"),
});

const defaultValues = {
  fullName: "",
  phone: "",
  gender: "male",
  age: "",
  cnic: "",
  address: "",
  admissionFees: "",
  fees: "",
  feesAfterDiscount: "",
};

const useMemberForm = (editMember = null) => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const age = form.watch("age");
  const showCnic = Number(age) >= 18;

  useEffect(() => {
    if (editMember) {
      form.reset({
        fullName: editMember.fullName,
        phone: editMember.phone,
        gender: editMember.gender,
        age: editMember.age,
        cnic: editMember.cnic ?? "",
        address: editMember.address ?? "",
        admissionFees: editMember.admissionFees ?? "",
        fees: editMember.fees,
        feesAfterDiscount: editMember.feesAfterDiscount,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editMember]);

  return { form, showCnic };
};

export default useMemberForm;
