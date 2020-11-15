import { FormControl, Box, Button } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";

import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

import { useForgotPasswordMutation } from "../generated/graphql";
import { re } from "../utils/constants";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [error, setError] = useState(false);
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          if (re.test(String(values.email).toLowerCase())) {
            await forgotPassword(values);
            setComplete(true);
          }
          setError(true);
        }}>
        {({ values, isSubmitting }) =>
          complete ? (
            <Box>
              if an account with this email exists, we sent you an email
            </Box>
          ) : (
            <Form>
              <FormControl>
                <Box mt={4}>
                  <InputField
                    name='email'
                    label='Email'
                    placeholder='email'
                    value={values.email}
                  />
                </Box>

                {error ? <Box>Please enter a valid email</Box> : null}

                <Button
                  mt={5}
                  type='submit'
                  ml={117}
                  p={6}
                  variantColor='teal'
                  isLoading={isSubmitting}>
                  Forgot Password
                </Button>
              </FormControl>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
