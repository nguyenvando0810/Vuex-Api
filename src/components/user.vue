<template>
  <div class="user">
    <el-row :gutter="20" style="margin: 0">
      <el-col :span="16" :offset="5">
        <div class="user_wrapper">
          <el-input v-model="searchName" class="searchName" @keyup.enter.native="searchUserName"/>
          <el-button type="primary" icon="el-icon-search" @click="searchUserName" circle/>
          <el-button type="primary" icon="el-icon-plus" @click="openAddUser" circle/>
        </div>
        <div class="grid-content bg-purple">
          <el-table :data="listUsers" stripe style="width: 100%">
            <el-table-column prop="username" label="User name"></el-table-column>
            <el-table-column prop="birthday" label="Birthday"></el-table-column>
            <el-table-column prop="email" label="Email"></el-table-column>
            <el-table-column prop="gender" label="Gender"></el-table-column>
            <el-table-column label="Action">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" @click="openUpdateUser(scope.row)">Edit</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="openDeleteUser(scope.row)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-dialog v-if="isFormVisible" :title="(dialogStatus === 'edit') ? 'Edit Eser' : 'Create User'" :visible.sync="isFormVisible" width="50%" append-to-body :close-on-click-modal="false" class="user_dialog">
      <el-form :rules="rules" ref="dataUser" :model="dataUser" >
        <el-form-item label="UserName" prop="username" required>
          <el-input v-model="dataUser.username"></el-input>
        </el-form-item>

        <el-form-item label="Birthday" prop="birthday"  required>
          <el-date-picker type="date" :picker-options="datePickerOptions" placeholder="Pick a date" v-model="dataUser.birthday" style="width: 100%;"></el-date-picker>
        </el-form-item>

        <el-form-item label="Email" prop="email" required>
          <el-input :disabled="dialogStatus === 'edit'" v-model="dataUser.email"></el-input>
        </el-form-item>

        <el-form-item label="Gender" prop="gender" required>
          <!-- <el-input v-model="dataUser.gender"></el-input> -->
          <el-select v-model="dataUser.gender" clearable placeholder="Select">
            <el-option label="Man" value="Man"></el-option>
            <el-option label="Woman" value="Woman"></el-option>
            <el-option label="LGBT" value="LGBT"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isFormVisible = false">Cancel</el-button>
        <el-button v-if="dialogStatus === 'create'" :loading="loading" type="primary" @click="addUser">Create</el-button>
        <el-button v-if="dialogStatus === 'edit'" :loading="loading" type="primary" @click="editUser">Edit</el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="isFormDeleteVisible" :visible.sync="isFormDeleteVisible" width="30%" title="Delete User"  :close-on-click-modal="false" class="user_dialog">
      <p class="mes_delete">Are you sure want to delete this user ？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isFormDeleteVisible = false">Cancel</el-button>
        <el-button type="danger" :loading="loading" @click="deleteUser">Delete</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import moment from 'moment'

export default {
  name: "User",

  data() {
    return {
      isFormVisible: false,
      isFormDeleteVisible: false,
      dataUser: {
        birthday: '',
        email: '',
        gender: '',
        username: ''
      },
      searchName: '',
      dialogStatus: '',
      rules: {
        username: [{ required: true, message: 'Please input user name', trigger: ['change', 'blur'] }],
        birthday: [{ type: 'date', required: true, message: 'Please pick a date', trigger: ['change', 'blur'] }],
        email: [
          { required: true, message: 'Please input email address', trigger: ['change', 'blur'] },
          { type: 'email', message: 'Please input correct email address', trigger: ['change', 'blur'] }],
        gender: [{ required: true, message: 'Please pick a gender', trigger: ['change', 'blur'] }]
      },
      datePickerOptions: {
        disabledDate(date) {
          return date > new Date()
        }
      },
      idUserDelete: '',
      loading: false
    }
  },

  created() {
    this.getUser()
  },

  computed: {
    listUsers() {
      return this.$store.state.users
    }
  },

  methods: {
    getUser() {
      this.$store.dispatch("getData")
    },

    openAddUser() {
      this.isFormVisible = true
      this.dialogStatus = 'create'
      this.clearFrom()
    },

    clearFrom() {
      this.dataUser.username = ''
      this.dataUser.email = ''
      this.dataUser.gender = ''
      this.dataUser.birthday = ''
    },

    addUser() {
      this.$refs['dataUser'].validate((valid) => {
        if(valid) {
          this.loading = true
          this.dataUser.birthday = new Date(new Date(moment(this.dataUser.birthday, 'YYYY-MM-DD')))

          this.$store.dispatch('addUser', this.dataUser).then(()=>{
            setTimeout(() => {
              this.clearFrom()
              this.loading = false
              this.isFormVisible = false
            }, 1000);
          })
        }
      })
    },

    openDeleteUser(data) {
      this.isFormDeleteVisible = true
      this.idUserDelete = data.id
    },

    deleteUser() {
      this.loading = true
      this.$store.dispatch("deleteUser", this.idUserDelete).then(() => {
        setTimeout(() => {
          this.getUser()
          this.isFormDeleteVisible = false
          this.loading = false
        }, 1000);
      })
    },

    searchUserName() {
      this.$store.dispatch("searchUser", this.searchName)
    },

    openUpdateUser(user) {
      this.isFormVisible = true
      this.dialogStatus = 'edit'

      Object.assign(this.dataUser, user)
      this.dataUser.birthday = new Date(moment(user.birthday, 'YYYY-MM-DD'))
    },

    editUser() {
      this.$refs['dataUser'].validate((valid) =>  {
        if(valid) {
          this.loading = true

          this.$store.dispatch('editUser', this.dataUser).then(() => {
            setTimeout(() => {
              this.isFormVisible = false
              this.loading = false
            }, 1000);
          })
        }
      })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .user_wrapper {
    display: flex;

    .searchName {
      width: 50%;
      margin-right: 20px;
    }
  }
  .el-button  {
    font-family: 'Montserrat', sans-serif;
  }

  .user_dialog {
    font-family: 'Montserrat', sans-serif;
    .el-dialog {
      padding: 20px 30px;
      .el-dialog__header {
        text-align: center;
      }
      .el-dialog__title {
        font-size: 40px;
        color:#409EFF;
      }
    }
    .el-form-item__label {
      font-weight: bold
    }
    .el-form-item.is-required .el-form-item__label:before {
      float: right;
    }
    .el-select {
      width: 100%;
    }
  }

  .mes_delete {
    text-align: center;
    font-size: 20px;
  }
</style>
