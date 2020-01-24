<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-info py-7 py-lg-8 pt-lg-9">
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <div class="container mt-lg--8 mt--6 pb-5">
      <div class="row justify-content-center">
        <div class="col">
          <card class="no-border-card" header-classes="border-0 pb-0" body-classes="pt-3 px-0" footer-classes="border-0 pb-2 pt-0">
            <template slot="header">
              <div class="row">
                <div class="col my-auto">
                  <h3 class="d-inline-block">메일</h3>
                  <el-tooltip placement="bottom">
                    <div slot="content" class="row">
                      <div class="col-12">
                        SMTP 서버: <code>smtp.mailgun.org</code><br>
                        포트: <code>25, 587, 465</code><br>
                        사용자 이름: <code>설정한 이름@poppin.party</code>
                      </div>
                    </div>
                    <i class="fas fa-question-circle"></i>
                  </el-tooltip>
                </div>
                <div class="col-auto">
                  <base-button type="neutral" @click="onAdd">추가</base-button>
                </div>
              </div>
            </template>
            <div>
              <el-table :data="tableDataProcess"
                        header-row-class-name="thead-light"
                        @sort-change="sortChange">
                <template>
                  <el-table-column v-bind="tableColumns[0]">
                    <template slot-scope="{row}">
                      <template v-if="!row.edit">
                        {{ row.name }} <code>@poppin.party</code>
                      </template>
                      <base-input input-classes="form-control-flush" v-model="row.name" class="mb-0" placeholder="이름" formGroupClasses="mb-0" v-else></base-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center">
                    <template slot-scope="{row}">
                      <div class="table-actions">
                        <template v-if="row.edit">
                          <el-tooltip content="취소" placement="top">
                            <div class="d-inline-flex mx-1" @click.prevent="onCancel(row)">
                              <i class="fas fa-times"></i>
                            </div>
                          </el-tooltip>
                          <el-tooltip content="확인" placement="top">
                            <div class="d-inline-flex mx-1" @click.prevent="onSubmit(row)">
                              <i class="fas fa-check"></i>
                            </div>
                          </el-tooltip>
                        </template>
                        <template v-else>
                          <el-tooltip content="삭제" placement="top">
                            <div class="d-inline-flex mx-1" @click.prevent="onDelete(row)">
                              <i class="fas fa-trash"></i>
                            </div>
                          </el-tooltip>
                        </template>
                      </div>
                    </template>
                  </el-table-column>
                </template>
              </el-table>
            </div>
            <div slot="footer" class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
              <p class="card-category">
                전체 {{ total }}개의 결과 중 {{ from + 1 }} ~ {{ to }} 항목 표시 중
              </p>
              <base-pagination class="pagination-no-border" v-model="pagination.currentPage" :per-page="pagination.perPage" :total="total"></base-pagination>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Table, TableColumn } from 'element-ui'
  import { BasePagination } from '@/components/argon-core'
  import swal from 'sweetalert2';
  import axios from 'axios'

  export default {
    layout: 'AuthLayout',
    components: {
      BasePagination,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    created() {
      this.loadData()
    },
    data() {
      return {
        tableColumns: [
          {
            prop: 'name',
            label: '이름',
            minWidth: 150,
            sortable: true
          }
        ],
        tableData: [],
        pagination: {
          perPage: 25,
          currentPage: 1,
          total: 0
        }
      }
    },
    methods: {
      loadData() {
        let url = '/api/mailgun'
        axios.get(url)
          .then(res => {
            let data = res.data.items
            data.filter(val => {
              if (val.edit === undefined) val.edit = false
              return val.name = val.login.match(/([^@]+)/ug)[0]
            })
            this.tableData = data
          })
          .catch(err => {})
      },
      sortChange({ prop, order }) {
        if (prop) {
          this.tableData.sort((a, b) => {
            let aVal = a[prop]
            let bVal = b[prop]
            if (order === 'ascending') {
              return aVal > bVal ? 1 : -1
            }
            return bVal - aVal ? 1 : -1
          })
        }
        else {
          this.tableData.sort((a, b) => {
            return a.id - b.id
          })
        }
      },
      onAdd() {
        this.tableData.push({
          name: '',
          edit: true
        })
      },
      onDelete(row) {
        swal.fire({
          icon: 'question',
          title: '해당 메일 정보를 삭제하시겠습니까?',
          html: `<strong>${row.name}</strong>@poppin.party`,
          showCancelButton: true,
          customClass: {
            confirmButton: 'btn btn-danger btn-fill',
            cancelButton: 'btn btn-default btn-fill'
          },
          confirmButtonText: '삭제',
          cancelButtonText: '취소',
          buttonsStyling: false,
          reverseButtons: true
        })
        .then((result) => {
          if (result.value) {
            axios.delete(`/api/mailgun/${row.name}`)
              .then(response => {
                if (!response.status === 200) throw new Error(response.statusText)
                swal.fire({
                  icon: 'success',
                  title: `성공적으로 삭제했습니다.`,
                  buttonsStyling: false,
                  customClass: {
                    confirmButton: 'btn btn-default btn-fill'
                  }
                })
                this.loadData()
              })
              .catch(err => {
                swal.fire({
                  icon: 'error',
                  title: '오류가 발생했습니다.',
                  text: err.message,
                  buttonsStyling: false,
                  customClass: {
                    confirmButton: 'btn btn-default btn-fill'
                  }
                })
              })
          }
        })
      },
      onCancel(row) {
        this.tableData.pop()
      },
      onSubmit(row) {
        axios.post('/api/mailgun', {name: row.name})
          .then(res => {
            swal.fire({
              icon: 'success',
              title: `요청을 성공적으로 처리했습니다.`,
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-default btn-fill'
              }
            })
            this.loadData()
          })
          .catch(err => {
            swal.fire({
              icon: 'error',
              title: '오류가 발생했습니다.',
              text: err.message,
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-default btn-fill'
              }
            })
          })
      }
    },
    computed: {
      to() {
        let highBound = this.from + this.pagination.perPage;
        if (this.total < highBound) {
          highBound = this.total;
        }
        return highBound;
      },
      from() {
        return this.pagination.perPage * (this.pagination.currentPage - 1);
      },
      total() {
        return this.tableData.length
      },
      tableDataProcess() {
        return this.tableData.slice(this.from, this.to)
      }
    }
  }
</script>