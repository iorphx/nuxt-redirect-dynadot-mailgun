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
                  <h3>서브도메인</h3>
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
                        {{ row.Subhost[0] }}
                      </template>
                      <base-input input-classes="form-control-flush" v-model="row.Subhost[0]" placeholder="서브도메인" formGroupClasses="mb-0" v-else></base-input>
                    </template>
                  </el-table-column>
                  <el-table-column v-bind="tableColumns[1]">
                    <template slot-scope="{row}">
                      <template v-if="!row.edit">
                        {{ row.Value[0] }}
                      </template>
                      <base-input input-classes="form-control-flush" v-model="row.Value[0]" placeholder="도착 주소" formGroupClasses="mb-0" v-else></base-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center">
                    <template slot-scope="{row}">
                      <div class="table-actions" v-if="row.RecordType[0] === 'Forward'">
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
                          <el-tooltip content="수정" placement="top">
                            <div class="d-inline-flex mx-1" @click.prevent="onEdit(row)">
                              <i class="fas fa-edit"></i>
                            </div>
                          </el-tooltip>
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
            prop: 'Subhost',
            label: '서브도메인',
            minWidth: 150,
            sortable: true
          },
          {
            prop: 'Value',
            label: '도착 주소',
            minWidth: 300,
            sortable: true
          }
        ],
        tableData: [],
        mainRcd: [],
        pagination: {
          perPage: 25,
          currentPage: 1,
          total: 0
        }
      }
    },
    methods: {
      loadData() {
        let url = '/api/subdomain'
        axios.get(url)
          .then(res => {
            let data = res.data.DomainInfoResponse.DomainInfoContent[0].Domain[0].NameServerSettings[0].SubDomains[0].SubDomainRecord
            data.filter(val => {
              if (val.edit === undefined) return val.edit = false
            })
            this.tableData = data
            this.mainRcd = res.data.DomainInfoResponse.DomainInfoContent[0].Domain[0].NameServerSettings[0].MainDomain[0].MainDomainRecord
          })
          .catch(err => {})
      },
      submitData() {
        let temp = ''
        for (let i = 0; i < this.mainRcd.length; i++) {
          if (this.mainRcd[i].RecordType[0] === 'MX') temp += `&main_record_type${i}=${this.mainRcd[i].RecordType[0].toLowerCase()}&main_record${i}=${encodeURIComponent(this.mainRcd[i].Value[0])}&main_recordx${i}=10`
          else temp += `&main_record_type${i}=${this.mainRcd[i].RecordType[0].toLowerCase()}&main_record${i}=${encodeURIComponent(this.mainRcd[i].Value[0])}`
        }
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].RecordType[0] === 'Forward') temp += `&subdomain${i}=${this.tableData[i].Subhost[0]}&sub_record_type${i}=${this.tableData[i].RecordType[0].toLowerCase()}&sub_record${i}=${encodeURIComponent(this.tableData[i].Value[0])}&sub_recordx${i}=1`
          else temp += `&subdomain${i}=${this.tableData[i].Subhost[0]}&sub_record_type${i}=${this.tableData[i].RecordType[0].toLowerCase()}&sub_record${i}=${encodeURIComponent(this.tableData[i].Value[0])}`
        }
        axios.post('/api/subdomain', { url: temp })
          .then(res => {
            swal.fire({
              icon: 'success',
              title: `요청을 성공적으로 처리했습니다.`,
              text: '서브도메인은 API 서버에 등록이 완료되어도 실제 적용까지는 시간이 다소 걸립니다.',
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
          Subhost: [''],
          RecordType: ['Forward'],
          Value: [''],
          edit: true,
          new: true
        })
      },
      onEdit(row) {
        row.edit = true
        row.old = {
          Subhost: row.Subhost[0],
          Value: row.Value[0]
        }
      },
      onDelete(row) {
        swal.fire({
          icon: 'question',
          title: '해당 리디렉션 정보를 삭제하시겠습니까?',
          html: `<strong>서브도메인 : ${row.Subhost[0]}<br>도착 주소 : ${row.Value[0]}</strong>`,
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
            let idx = this.tableData.findIndex(function(item) {return item === row})
            if (idx > -1) this.tableData.splice(idx, 1)
            this.submitData()
          }
        })
      },
      onCancel(row) {
        if (row.new === undefined) {
          row.Subhost[0] = row.old.Subhost
          row.Value[0] = row.old.Value
          row.old = undefined
          row.edit = false
        }
        else this.tableData.pop()
      },
      onSubmit(row) {
        this.submitData()
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