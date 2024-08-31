import { useDispatch, useSelector } from 'react-redux';
import { addContact, selectContacts } from '../../redux/contactsSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { nanoid } from 'nanoid';
import styles from './ContactForm.module.css';

const formatPhoneNumber = (value) => {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;

  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }

  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 5)}-${phoneNumber.slice(5, 7)}`;
};

const ContactForm = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);

  return (
    <Formik
      initialValues={{ name: '', number: '' }}
      validationSchema={Yup.object({
        name: Yup.string()
          .min(3, 'Must be at least 3 characters')
          .max(50, 'Must be 50 characters or less')
          .required('Required'),
        number: Yup.string()
          .matches(/^\d{3}-\d{2}-\d{2}$/, 'The number should follow the pattern 123-45-67')
          .required('Required'),
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        const newContact = {
          id: nanoid(),
          name: values.name,
          number: values.number,
        };

        const isDuplicate = contacts.some(
          (contact) =>
            contact.name.toLowerCase() === newContact.name.toLowerCase() ||
            contact.number === newContact.number
        );

        if (isDuplicate) {
          alert('This contact already exists.');
          setSubmitting(false);
          return;
        }

        dispatch(addContact(newContact));
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ values, handleChange }) => (
        <Form className={styles.form}>
          <label htmlFor="name">Name</label>
          <Field name="name" type="text" />
          <ErrorMessage name="name" component="div" className={styles.error} />

          <label htmlFor="number">Number</label>
          <Field
            name="number"
            type="text"
            value={values.number}
            onChange={(e) => {
              e.target.value = formatPhoneNumber(e.target.value);
              handleChange(e);
            }}
          />
          <ErrorMessage name="number" component="div" className={styles.error} />

          <button type="submit">Add contact</button>
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;
