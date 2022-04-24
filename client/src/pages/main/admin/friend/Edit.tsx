import { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { Grid, Container } from '@mui/material'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import { deepOrange, green } from '@mui/material/colors'

import CustomButton from 'components/Button/CustomButton'
import FormInput from 'components/Fields/FormInput'
import FormSelect from 'components/Fields/FormMultiSelect'
import CustomBreadcrumbs from 'components/Breadcrumbs/CustomBreadcrumbs'
import ConfirmDialog from 'components/Dialog/ConfirmDialog'

import { useAppDispatch, useAppSelector } from 'store/hooks'
import { RootState } from 'store/store'
import { getFriendById, updateFriend } from 'store/friend'
import { getUsers } from 'store/user'

import Header from 'layout/Header'

const validationSchema = Yup.object().shape({
  friendname: Yup.string().required('Enter your username'),
  email: Yup.string().required('Enter your Email').email('Enter a valid Email')
})

const hobbies = [
  { value: 'pingpong', label: 'Pingpong' },
  { value: 'pingpong', label: 'Basketball' },
  { value: 'pingpong', label: 'Valleyball' },
  { value: 'pingpong', label: 'Football' },
  { value: 'pingpong', label: 'Reading' }
]

interface FriendForm {
  id: number
  friendname: string
  email: string
  gender: string
  age: number
  hobbies: string
  description: string
  userId: number
}

const Edit = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(false)

  const loaction = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state: RootState) => state.auth)
  const { users } = useAppSelector((state: RootState) => state.user)
  const { loading, friend } = useAppSelector((state: RootState) => state.friend)

  const pathnames = loaction.pathname.split('/').filter((x) => x)

  useEffect(() => {
    dispatch(getFriendById(Number(pathnames.at(-1))))
      .unwrap()
      .then((resolve) => {})
      .catch((error) => {
        toast.error(error.message)
      })
    dispatch(getUsers())
      .unwrap()
      .then((resolve) => {})
      .catch((error) => {
        toast.error(error.message)
      })
  }, [])

  const handleConfirmModal = () => {
    setOpen(true)
  }

  const formik = useFormik({
    initialValues: friend.data ?? {},
    validationSchema,
    onSubmit: (values, actions) => {
      handleConfirmModal()
      if (value) {
        dispatch(updateFriend(values))
          .unwrap()
          .then((resolve) => {
            toast.success('Friend was updateded successfully')
            navigate('/friend')
          })
          .catch((error) => {
            toast.error(error.message)
          })
        actions.resetForm()
      } else {
        return
      }
    }
  })

  useEffect(() => {
    formik.setValues(friend.data)
  }, [friend.data, formik.setValues])

  const handleClose = (newValue?: boolean) => {
    setOpen(false)

    if (newValue) {
      setValue(newValue)
      formik.handleSubmit()
    }
  }

  return (
    <>
      <Header />
      <Container>
        <Grid container>
          <Grid item py={2}>
            <CustomBreadcrumbs root="admin" />
          </Grid>
        </Grid>
        <Divider />

        <Grid pt={2}></Grid>
        <Card>
          <CardContent>
            <Grid container py={2} spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Avatar
                      alt={friend.data.friendname}
                      src="/broken-image.jpg"
                      sx={{
                        bgcolor: green[500],
                        width: 250,
                        height: 250,
                        fontSize: 200
                      }}
                      className="mx-auto uppercase"
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid
                item
                container
                justifyContent="center"
                xs={12}
                md={8}
                spacing={4}
              >
                <Grid item xs={12}>
                  <div className="flex justify-center">
                    <p className="font-podium49 text-4xl uppercase text-grey">
                      {users.data.map((value, key) => {
                        for (let i = 0; i < users.data.length; i++) {
                          if (value.id === friend.data.userId) {
                            return value.username
                          }
                        }
                      })}
                    </p>
                    <p className="font-podium49 text-4xl uppercase">
                      's Friend
                    </p>
                  </div>
                </Grid>

                <Grid item xs={10} className="!mx-auto">
                  <form onSubmit={formik.handleSubmit}>
                    <Grid
                      item
                      container
                      justifyContent="center"
                      spacing={2}
                      xs={12}
                    >
                      <Grid item xs={12}>
                        <FormInput
                          id="friendname"
                          name="friendname"
                          formik={formik}
                          handleChange={formik.handleChange}
                          className="font-inter text-base font-normal"
                          label="Name"
                          placeholder="Name"
                          isHint={true}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormInput
                          id="email"
                          type="email"
                          name="email"
                          formik={formik}
                          handleChange={formik.handleChange}
                          className="font-inter text-base font-normal"
                          label="Email"
                          placeholder="Email"
                          isHint={true}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl>
                          <FormLabel id="demo-radio-buttons-group-label">
                            Gender
                          </FormLabel>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="gender"
                            value={formik.values['gender']}
                            onChange={formik.handleChange}
                            defaultValue="female"
                            row
                          >
                            <FormControlLabel
                              value="female"
                              control={<Radio />}
                              label="Female"
                            />
                            <FormControlLabel
                              value="male"
                              control={<Radio />}
                              label="Male"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormInput
                          type="number"
                          id="age"
                          name="age"
                          formik={formik}
                          handleChange={formik.handleChange}
                          className="font-inter text-base font-normal"
                          label="Age"
                          placeholder="Age"
                          isHint={true}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormSelect
                          id="hobbies"
                          name="hobbies"
                          options={hobbies}
                          label="Hobby"
                          placeholder="Select your country"
                          multiple={true}
                          formik={formik}
                          // handleChange={formik.handleChange}
                          isHint={true}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormInput
                          type="text"
                          id="description"
                          name="description"
                          formik={formik}
                          handleChange={formik.handleChange}
                          className="font-inter text-base font-normal"
                          label="Description"
                          placeholder="Description"
                          isHint={true}
                        />
                      </Grid>
                      <Grid item container justifyContent="space-between">
                        <Grid item xs={4}>
                          <Link to="/friend">
                            <CustomButton
                              type="button"
                              model="primary"
                              variant="contained"
                              label="Back"
                              startIcon={
                                <ArrowBackIosNewIcon
                                  sx={{ fontSize: '14px !important' }}
                                />
                              }
                            />
                          </Link>
                        </Grid>
                        <Grid item xs={4}>
                          <CustomButton
                            type="submit"
                            model="primary"
                            variant="contained"
                            label="Update Friend"
                            loading={loading}
                            startIcon={<PlusOneIcon fontSize="large" />}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </Grid>
            </Grid>
            <ConfirmDialog
              id="add-friend"
              keepMounted
              open={open}
              onClose={handleClose}
              value={value}
            />
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export default Edit