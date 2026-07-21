import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const useCollectFeeForm = (member) => {
  const maxAmount = member?.latestFee?.remaining ?? member?.feesAfterDiscount ?? 0;

  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const schema = useMemo(() => yup.object({
    amount: yup
      .number()
      .typeError("Amount must be a number")
      .min(1, "Amount must be at least 1")
      .max(maxAmount, "you cannot add amount greater than your dues")
      .required("Amount is required"),
    method: yup
      .string()
      .oneOf(["cash", "online", "card"], "Select a payment method")
      .required("Payment method is required"),
    note: yup.string().trim(),
    isToday: yup.boolean().default(true),
    paidDate: yup.string().when("isToday", {
      is: false,
      then: (schema) => schema.required("Please select a date"),
      otherwise: (schema) => schema.optional()
    })
  }), [maxAmount]);

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      amount: maxAmount || "",
      method: "cash",
      note: "",
      isToday: true,
      paidDate: "",
    },
  });

  useEffect(() => {
    if (member) {
      const maxAmt = member.latestFee?.remaining ?? member.feesAfterDiscount ?? 0;
      form.reset({
        amount: maxAmt || "",
        method: "cash",
        note: "",
        isToday: true,
        paidDate: "",
      });
    }
  }, [member?._id]);

  return { form };
};

export default useCollectFeeForm;
