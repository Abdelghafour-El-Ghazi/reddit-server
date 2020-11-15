import { FormControl, Box, Button, Link, Flex } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import React from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrorMap";
import { useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import { useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import NextLink from "next/link";

const ChangePassword: NextPage = () => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = useState("");

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);

            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}>
        {({ values, isSubmitting }) => (
          <Form>
            <FormControl>
              <Box mt={4}>
                <InputField
                  name='newPassword'
                  label='New Password'
                  placeholder='new password'
                  id='newPassword'
                  value={values.newPassword}
                  textarea={false}
                  type='password'
                />
              </Box>
              {tokenError ? (
                <Flex>
                  <Box mr={4} style={{ color: "red" }}>
                    {tokenError}
                  </Box>
                  <NextLink href='/forgot-password'>
                    <Link style={{ color: "blue" }}>
                      Click here to get a new one{" "}
                    </Link>
                  </NextLink>
                </Flex>
              ) : null}
              <Button
                mt={5}
                ml={117}
                type='submit'
                variantColor='teal'
                isLoading={isSubmitting}>
                Change password
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(
  ChangePassword as React.FunctionComponent
);
