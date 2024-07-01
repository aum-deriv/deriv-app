import * as Yup from 'yup';

const verifyPersonalDetailsValidationSchema = Yup.object().shape({
    dateOfBirth: Yup.date().required('Please enter your date of birth'),
    firstName: Yup.string()
        .required('This field is required')
        .matches(/^[a-zA-Z\s\-.'']+$/, 'Letters, spaces, periods, hyphens, apostrophes only.')
        .min(1, 'Enter no more than 50 characters.')
        .max(50, 'Enter no more than 50 characters.'),
    lastName: Yup.string()
        .required('This field is required')
        .matches(/^[a-zA-Z\s\-.'']+$/, 'Letters, spaces, periods, hyphens, apostrophes only.')
        .min(1, 'Enter no more than 50 characters.')
        .max(50, 'Enter no more than 50 characters.'),
});

export default verifyPersonalDetailsValidationSchema;
