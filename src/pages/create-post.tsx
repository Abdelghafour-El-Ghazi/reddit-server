import { FormControl, Box, Button } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  useIsAuth();
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();

  return (
    <Layout variant='small'>
      {" "}
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });

          if (!error) {
            router.push("/");
          }
        }}>
        {({ values, isSubmitting }) => (
          <Form>
            <FormControl>
              <Box mt={4}>
                <InputField
                  name='title'
                  label='Title'
                  textarea={false}
                  placeholder='title'
                  value={values.title}
                  id='title'
                />
              </Box>
              <Box mt={4}>
                <InputField
                  name='text'
                  label='Text'
                  textarea={true}
                  placeholder='text'
                  id='text'
                  value={values.text}
                  type='text'
                />
              </Box>

              <Button
                mt={5}
                type='submit'
                ml={137}
                p={6}
                variantColor='teal'
                isLoading={isSubmitting}>
                Create Post
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>{" "}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
