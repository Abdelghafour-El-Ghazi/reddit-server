import React from "react";
import { FormControl, Button, Box, Link, Flex } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);

          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              // worked
              router.push("/");
            }
          }
        }}>
        {({ values, isSubmitting }) => (
          <Form>
            <FormControl>
              <Box mt={4}>
                <InputField
                  name='usernameOrEmail'
                  label='Username or Email'
                  placeholder='username or email'
                  value={values.usernameOrEmail}
                  id='usernameOrEmail'
                />
              </Box>
              <Box mt={4}>
                <InputField
                  name='password'
                  label='Password'
                  placeholder='password'
                  id='password'
                  value={values.password}
                  type='password'
                />
              </Box>
              <Flex>
                <NextLink href='/forgot-password'>
                  <Link mt={2} ml='auto' style={{ color: "blue" }}>
                    Forgot password ?{" "}
                  </Link>
                </NextLink>
              </Flex>

              <Button
                mt={5}
                type='submit'
                ml={147}
                p={6}
                variantColor='teal'
                isLoading={isSubmitting}>
                Login
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
