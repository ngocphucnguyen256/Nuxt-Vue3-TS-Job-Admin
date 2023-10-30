<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <AdminLayout>
    <div class="rounded-lg bg-white p-30">
      <h3>案件登録</h3>
      <h5 class="mb-4 font-weight-regular">案件の情報を登録します。</h5>
      <v-form ref="formEdit" v-model="validEdit" lazy-validation>
        <v-row>
          <v-col cols="4">
            <SelectBox
              name="契約会社"
              :items="clientSelectList"
              :value="dataForm.client_id"
              :is-horizontal="false"
              :loading="loadingClients"
              :rules="validation.required"
              @update:model-value="dataForm.client_id = $event"
            />
          </v-col>
          <v-col cols="4">
            <InputField
              name="お客様コード"
              :model-value="dataForm.client_code"
              :disabled="true"
              :loading="loadingClientDetail"
              @update:model-value="dataForm.client_code = $event"
            />
          </v-col>
          <v-col cols="4">
            <InputField
              name="担当者"
              :model-value="dataForm.client_name"
              :disabled="true"
              @update:model-value="dataForm.client_name = $event"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <InputField
              name="案件名"
              :rules="validation.required"
              :model-value="dataForm.project_name"
              @update:model-value="dataForm.project_name = $event"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <InputField
              name="案件コード"
              :model-value="dataForm.project_code"
              @update:model-value="dataForm.project_code = $event"
            />
          </v-col>
          <v-col cols="4">
            <DatePicker
              title="開始日"
              :model-value="startDayInput"
              @update:model-value="startDayInput = $event"
            />
          </v-col>
          <v-col cols="4">
            <DatePicker
              title="終了日"
              :model-value="endDayInput"
              @update:model-value="endDayInput = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <InputField
              name="場所"
              :rules="validation.required"
              :model-value="dataForm.city"
              @update:model-value="dataForm.city = $event"
            />
          </v-col>
          <v-col cols="4">
            <InputField
              name="地区"
              :rules="validation.required"
              :model-value="dataForm.province"
              @update:model-value="dataForm.province = $event"
            />
          </v-col>
          <v-col cols="4">
            <InputField
              name="住所"
              :rules="validation.required"
              :model-value="dataForm.street_name"
              @update:model-value="dataForm.street_name = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <ComboBox
              name="時給"
              :value="salaryHour"
              :rules="validation.arrayNumber"
              @update:model-value="salaryHour = $event"
            />
          </v-col>
          <v-col cols="4">
            <ComboBox
              name="日給"
              :value="salaryDayInput"
              :rules="validation.arrayNumber"
              @update:model-value="salaryDayInput = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <InputField
              name="人数"
              :model-value="dataForm.amount_of_people"
              @update:model-value="dataForm.amount_of_people = $event"
            />
          </v-col>
          <v-col cols="4">
            <SelectBox
              name="ジャンル"
              :items="projectTypeList"
              :value="dataForm.type"
              :is-horizontal="false"
              @update:model-value="dataForm.type = $event"
            />
          </v-col>
          <v-col cols="4">
            <SelectBox
              name="ステータス"
              :items="projectStatusItems"
              :value="dataForm.status"
              :is-horizontal="false"
              :rules="validation.required"
              @update:model-value="dataForm.status = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <TextareaField
              name="備考"
              :model-value="dataForm.notes"
              @update:model-value="dataForm.notes = $event"
            />
          </v-col>
        </v-row>

        <div class="d-flex mt-6">
          <v-btn
            class="lighten-1 mr-2"
            color="btn"
            size="large"
            @click="handleSubmitEditProject"
          >
            登録
          </v-btn>
        </div>
      </v-form>
      <DialogLoader
        :loading="submitEditProjectDialogLoading.isLoading"
        :dialog="submitEditProjectDialogLoading.isShowDialog"
        :is-successful="submitEditProjectDialogLoading.isSuccessful"
        :message="submitEditProjectDialogLoading.message"
      />
      <!-- /.form-->
    </div>

    <div class="mt-7">
      <v-row class="m-0" justify="space-between">
        <v-col cols="8" class="rounded-lg bg-white p-30">
          <h3>メール送信</h3>
          <h5 class="mb-4 font-weight-regular">
            メールを作成し、送信ボタンを押すと、下のリストから選択したスタッフにメールが送信されます。※右側のメールテンプレート一覧から選択して簡単にメールを作成できます。
          </h5>
          <ErrorLine
            :message="mailErrorLine.message.value"
            :success="mailErrorLine.isSuccess.value"
          />
          <v-form v-model="validMailBody" lazy-validation>
            <InputField
              name="タイトル"
              :model-value="mailForm.subject"
              :rules="validation.requiredWithName('タイトル', mailForm.subject)"
              class="mb-2"
              @update:model-value="mailForm.subject = $event"
            />
            <TextareaField
              name="メール内容"
              :model-value="mailForm.content"
              :rows="5"
              :rules="
                validation.requiredWithName('メール内容', mailForm.content)
              "
              @update:model-value="mailForm.content = $event"
            />

            <div class="d-flex justify-center">
              <v-btn
                :disabled="!validMailBody || !isCheckedSelected"
                class="lighten-1 mt-2 mr-2"
                color="btn"
                @click="handleSendMail"
              >
                保存
              </v-btn>
            </div>
          </v-form>
        </v-col>
        <v-col cols="4" class="p-0">
          <div class="rounded-lg bg-white p-30 ml-8 h-100">
            <h3>テンプレート選択</h3>
            <SelectBox
              name="テンプレート選択"
              :items="templateItems"
              :value="templateForm.template_id"
              :is-horizontal="false"
              class="mb-2 mt-2"
              @update:model-value="templateForm.template_id = $event"
            />
            <InputField
              name="タイトル"
              readonly
              :model-value="templateForm.subject"
              class="mb-2"
              @update:model-value="templateForm.subject = $event"
            />
            <TextareaField
              name="メール内容"
              readonly
              :rows="6"
              :model-value="templateForm.content"
              class="mb-2"
              @update:model-value="templateForm.content = $event"
            />

            <div class="d-flex justify-center">
              <v-btn
                class="lighten-1 mt-2 mr-2"
                color="btn"
                @click="handleApplyTemplate"
              >
                このテンプレートを選択
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="block rounded-lg bg-white p-30 mt-7">
      <h3>案件に応募スタッフ一覧</h3>
      <h5 class="mb-4 font-weight-regular">
        採用中のスタッフの出席状況を確認できます。
      </h5>
      <div class="">
        <v-row align="center" class="mt-2">
          <v-col cols="4">
            <InputField
              name="キーワード"
              :is-horizontal="false"
              :model-value="staffTableDataSearch.q"
              hide-details
              append-inner-icon="mdi-magnify"
              @update:model-value="staffTableDataSearch.q = $event"
            />
          </v-col>
          <v-col cols="4">
            <RangePicker
              name="日付"
              :start-date="dialogTableSearch.start_day"
              :end-date="dialogTableSearch.end_day"
              :is-horizontal="false"
              @update:model-value-start-date="
                dialogTableSearch.start_day = $event
              "
              @update:model-value-end-date="dialogTableSearch.end_day = $event"
            />
          </v-col>
          <v-col cols="2"> </v-col>
        </v-row>
        <div class="d-flex justify-center">
          <v-btn
            :disabled="!validSearchForm"
            class="lighten-1 mt-4"
            color="btn"
            @click="handleSearchStaffTable"
          >
            検索
          </v-btn>
        </div>
      </div>

      <div class="block mt-5">
        <ErrorLine
          :message="staffTableErrorLine.message.value"
          :success="staffTableErrorLine.isSuccess.value"
        />
        <v-data-table
          v-model="selected"
          :headers="columnsTable"
          :items="staffTableData"
          :loading="staffTableLoading"
          :item-value="(item) => `${item.id}`"
          hide-default-footer
          item-key="no"
          show-select
          class="custom-table"
        >
          <template #loading>
            <LoaderComponent :loading="staffTableLoading" />
          </template>
          <template #top>
            <v-toolbar flat class="bg-white">
              <div
                class="d-flex mx-2 justify-space-between w-100 overflow-auto"
              >
                <v-btn
                  :color="checkButtonActive(1) ? 'grey' : ''"
                  class="mr-2 text-body-2"
                  :variant="checkButtonActive(1) ? 'flat' : 'plain'"
                  rounded="xl"
                  @click="() => toggleButtonButtonActive(1)"
                  >All ({{ staffTableMeta.count_all }})</v-btn
                >
                <v-btn
                  :color="checkButtonActive(2) ? 'grey' : ''"
                  class="mr-2 text-body-2"
                  :variant="checkButtonActive(2) ? 'flat' : 'plain'"
                  rounded="xl"
                  @click="() => toggleButtonButtonActive(2)"
                  >探用中 ({{ staffTableMeta.count_work }})</v-btn
                >
                <v-btn
                  :color="checkButtonActive(3) ? 'grey' : ''"
                  class="mr-2 text-body-2"
                  :variant="checkButtonActive(3) ? 'flat' : 'plain'"
                  rounded="xl"
                  @click="() => toggleButtonButtonActive(3)"
                  >末探用 ({{ staffTableMeta.count_waiting }})</v-btn
                >

                <v-btn
                  rounded="xl"
                  color="teal-accent-4"
                  variant="flat"
                  class="lighten-1 ml-auto mr-2"
                  :disabled="!isCheckedSelected"
                  @click="handleAcceptStaffToProject"
                >
                  + 採用一覧に追加
                </v-btn>
                <v-btn
                  rounded="xl"
                  color="indigo-darken-4"
                  variant="flat"
                  class="lighten-1 mr-2"
                  :disabled="!isStaffTableHaveAccepted"
                  @click="handleToggleDialogForm"
                >
                  + シフト設定
                </v-btn>
                <!-- tableDialog -->
                <v-dialog v-model="dialogTable">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="red"
                      rounded="xl"
                      variant="flat"
                      class="lighten-1 mr-2"
                      :disabled="!isStaffTableHaveAccepted"
                      @click="getDataReport()"
                    >
                      スタッフ出席状況へ
                    </v-btn>
                  </template>
                  <v-card class="rounded-lg p-30 overflow-auto">
                    <div class="d-flex flex-row-reverse">
                      <v-icon @click="dialogTable = false">mdi-close</v-icon>
                    </div>
                    <v-card-title class="mb-1">
                      <h3>スタッフ出席状況</h3>
                      <h5 class="font-weight-regular">
                        採用中のスタッフの出席状況を確認できます。
                      </h5>
                    </v-card-title>
                    <v-card-text class="p-2">
                      <v-row align="center" class="mb-1">
                        <v-col cols="3">
                          <SelectBox
                            hide-details
                            name="スタッフ名"
                            :items="staffAcceptedList"
                            :value="staffTableRPDetail.id"
                            @update:model-value="staffTableRPDetail.id = $event"
                          />
                        </v-col>
                        <v-col cols="4">
                          <RangePicker
                            name="日付"
                            :start-date="staffTableRPDetail.start_day"
                            :end-date="staffTableRPDetail.end_day"
                            :is-horizontal="false"
                            @update:model-value-start-date="
                              staffTableRPDetail.start_day = $event
                            "
                            @update:model-value-end-date="
                              staffTableRPDetail.end_day = $event
                            "
                          />
                        </v-col>
                        <v-col cols="3">
                          <v-btn
                            class="lighten-1 mt-4"
                            color="btn"
                            @click="handleDialogTableSearch"
                          >
                            検索
                          </v-btn>
                        </v-col>
                      </v-row>
                      <ErrorLine
                        :message="dialogTableErrorLine.message.value"
                        :success="dialogTableErrorLine.isSuccess.value"
                      />
                      <div v-if="!isDone" class="text-center mt-4">
                        <v-progress-circular
                          indeterminate
                          model-value="20"
                          color="primary"
                        ></v-progress-circular>
                      </div>
                      <div
                        v-for="(itemz, index) in dialogTableDataList"
                        v-if="isDone"
                        :key="index"
                      >
                        <v-data-table
                          v-model="selectedDialogTable"
                          :headers="columnsDialogTable"
                          :items="itemz.report"
                          hide-default-footer="true"
                          disable-pagination
                          item-key="no"
                          :item-value="(itemz) => handleReturnItemValue(itemz)"
                          class="custom-table striped-table table-dark-header"
                          select-strategy="all"
                          show-select
                        >
                          <template #[`item.date`]="{ item }">
                            <div style="min-width: 90px">
                              {{ item.raw.date }}
                            </div>
                          </template>
                          <template #[`item.level`]="{ item }">
                            <v-select
                              v-model="item.raw.level"
                              :disabled="validStatus(itemz)"
                              :items="levelList"
                              hide-details
                              class="w-100 select-custom-position-icon"
                              style="min-width: 80px"
                              variant="plain"
                              @update:model-value="
                                updateReport(item, item.raw.level, 'level')
                              "
                            />
                          </template>
                          <template #[`item.earnings`]="{ item }">
                            <v-btn
                              :disabled="validStatus(itemz)"
                              class="text-decoration-underline opacity-1 text-left p-0"
                              variant="plain"
                              color="blue"
                              @click="handleToggleDialogEarning(item.raw.id)"
                            >
                              <div :class="`earning-${item.raw.id}`">
                                {{
                                  item.raw.earnings ? item.raw.earnings : "0"
                                }}
                              </div>
                            </v-btn>
                          </template>
                          <template #[`item.unit_price`]="{ item }">
                            <InputField
                              v-model="item.raw.unit_price"
                              :disabled="validStatus(itemz)"
                              hide-details
                              class="w-100 h-100 mt-2"
                              style="min-width: 100px"
                              variant="plain"
                              @update:model-value="
                                debounce(() =>
                                  updateReport(
                                    item,
                                    item.raw.unit_price,
                                    'unit_price',
                                  ),
                                )
                              "
                            />
                          </template>
                          <template #[`item.payment_type`]="{ item }">
                            <v-select
                              v-model="item.raw.payment_type"
                              :disabled="true"
                              :items="paymentMethodItems"
                              hide-details
                              class="w-100 select-custom-position-icon"
                              style="min-width: 130px"
                              variant="plain"
                            />
                          </template>

                          <template #[`item.classification`]="{ item }">
                            <v-select
                              v-model="item.raw.classification"
                              :disabled="validStatus(itemz)"
                              :items="salaryMethodItems"
                              hide-details
                              class="w-100 select-custom-position-icon"
                              style="min-width: 100px"
                              variant="plain"
                              @update:model-value="
                                updateReport(
                                  item,
                                  item.raw.classification,
                                  'classification',
                                )
                              "
                            />
                          </template>
                          <template #top>
                            <v-toolbar flat class="bg-white">
                              <div
                                class="d-flex align-center w-100 justify-space-between overflow-auto"
                              >
                                <div class="d-flex">
                                  <p class="font-weight-bold mr-8">
                                    {{ itemz.staff }}
                                  </p>
                                  <p class="mr-12">休み：2日</p>
                                </div>
                                <div
                                  class="d-flex w-50 align-center justify-end"
                                >
                                  <SelectBox
                                    :disabled="validStatus(itemz)"
                                    hide-details
                                    name="ステータス："
                                    :items="staffStatusItems"
                                    :value="itemz.entry_status"
                                    :is-horizontal="true"
                                    class="mr-8 w-50 mb-2"
                                    @update:model-value="
                                      (e) =>
                                        handleChangeStatusDialogTableStatus(
                                          e,
                                          itemz,
                                        )
                                    "
                                  />
                                  <v-dialog
                                    v-model="dialogTableConfirmDialog"
                                    persistent
                                    width="auto"
                                  >
                                    <v-card class="pa-4 rounded-lg">
                                      <div class="d-flex flex-row-reverse">
                                        <v-icon
                                          @click="
                                            dialogTableConfirmDialog = false
                                          "
                                          >mdi-close</v-icon
                                        >
                                      </div>
                                      <v-card-title class="text-h5">
                                        Are you sure to change status?
                                      </v-card-title>
                                      <v-card-text>
                                        Are you sure to change
                                        status?</v-card-text
                                      >
                                      <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                          color="primary"
                                          variant="text"
                                          @click="
                                            handleRollbackChangeStatusDialogTable()
                                          "
                                        >
                                          CLOSE
                                        </v-btn>
                                        <v-btn
                                          color="primary"
                                          variant="flat"
                                          @click="
                                            handleSubmitChangeStatusStaffDialogTable()
                                          "
                                        >
                                          OK
                                        </v-btn>
                                      </v-card-actions>
                                    </v-card>
                                  </v-dialog>
                                  <v-btn
                                    :disabled="validConfirmSalary(itemz)"
                                    class="mr-8"
                                    color="indigo-darken-4"
                                    variant="flat"
                                    rounded="xl"
                                    @click="handleDialogTableAddSalary"
                                  >
                                    + 給料確定済み</v-btn
                                  >
                                </div>
                              </div>
                            </v-toolbar>
                          </template>
                          <template #bottom></template>
                        </v-data-table>
                        <div
                          class="block mt-8 head-line"
                          style="border-color: rgba(0, 0, 0, 0.4)"
                        ></div>
                      </div>
                      <div
                        v-for="(item, index) in staffIdleList"
                        v-show="!dialogTableSearch.id"
                        :key="index"
                      >
                        <div class="d-flex mt-4 mb-2">
                          <p class="font-weight-bold mr-8">
                            {{ item.title }}
                          </p>
                          <p class="mr-12">休み：0日</p>
                        </div>
                        <p>従業員はシフトに登録されていません</p>
                        <div
                          class="block mt-8 head-line"
                          style="border-color: rgba(0, 0, 0, 0.4)"
                        ></div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-dialog>

                <v-dialog v-model="dialogEarning" width="500">
                  <v-card class="rounded-lg p-30 overflow-auto mx-10">
                    <div class="d-flex flex-row-reverse">
                      <v-icon @click="dialogEarning = false">mdi-close</v-icon>
                    </div>
                    <v-card-title class="mb-2">
                      <h3>Dialog earning</h3>
                      <h4 class="h4-title font-weight-regular">
                        Dialog earning
                      </h4>
                    </v-card-title>
                    <v-card-text class="p-2">
                      <InputField
                        name="その他 (Others)"
                        :model-value="dialogEarningForm.others"
                        class="mb-2"
                        @update:model-value="dialogEarningForm.others = $event"
                      />
                      <InputField
                        name="前借（ー）"
                        class="mb-2"
                        :model-value="dialogEarningForm.advance"
                        @update:model-value="dialogEarningForm.advance = $event"
                      />
                      <InputField
                        class="mb-2"
                        name="立替経費"
                        :model-value="dialogEarningForm.expenses"
                        @update:model-value="
                          dialogEarningForm.expenses = $event
                        "
                      />
                      <v-row align="center">
                        <v-col cols="3">
                          <v-btn
                            class="lighten-1 mt-4"
                            color="btn"
                            @click="handleSubmitEarningAndCalculateSalary"
                          >
                            確定
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-dialog>

                <!-- dialog form 2 -->
                <v-dialog v-model="dialogForm">
                  <v-card class="rounded-lg p-30 overflow-auto">
                    <div class="d-flex flex-row-reverse">
                      <v-icon @click="dialogForm = false">mdi-close</v-icon>
                    </div>
                    <v-card-title class="mb-6">
                      <h3>シフト設定</h3>
                      <h4 class="h4-title font-weight-regular">
                        このプロジェクトに応募いただいたスタッフの一覧です。
                      </h4>
                    </v-card-title>
                    <v-card-text class="p-2">
                      <div class="">
                        <v-row align="center" class="mt-2">
                          <v-col cols="6">
                            <DatePicker
                              title="開始日"
                              :model-value="dialogFormSearch.start_date"
                              @update:model-value="
                                dialogFormSearch.start_date = $event
                              "
                            />
                          </v-col>
                          <v-col cols="6">
                            <DatePicker
                              title="終了日"
                              :model-value="dialogFormSearch.end_date"
                              @update:model-value="
                                dialogFormSearch.end_date = $event
                              "
                            />
                          </v-col>
                        </v-row>
                        <div class="d-flex justify-center">
                          <v-btn
                            class="lighten-1 mb-4 mt-4"
                            color="btn"
                            @click="handleDialogFormSearch"
                          >
                            検索
                          </v-btn>
                        </div>
                      </div>
                      <ErrorLine
                        :message="dialogFormErrorLine.message.value"
                        :success="dialogFormErrorLine.isSuccess.value"
                      />
                      <div>
                        <v-data-table
                          :headers="columnsDialogFormTable"
                          :items="dialogFormData"
                          hide-default-footer="true"
                          disable-pagination
                          item-key="no"
                          class="custom-table striped-table"
                          :item-value="(item) => `${item.date}`"
                          :loading="dialogFormLoading"
                        >
                          <template #[`item.staff`]="{ item: staffItem }">
                            <v-select
                              v-model="staffItem.raw.staff"
                              :items="staffListToSelect"
                              item-title="name"
                              item-text="name"
                              item-value="name"
                              chips
                              multiple
                              :disabled="
                                handleDisableComboboxSelectStaff(staffItem)
                              "
                              :value-comparator="(a, b) => a.name === b.name"
                              variant="plain"
                              class="mt-4"
                              return-object
                            >
                              <template #chip="{ item: chipItem }">
                                <div class="d-flex align-center mr-4">
                                  <v-avatar
                                    class="bg-blue text-uppercase mr-1"
                                    start
                                  >
                                    <v-img
                                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                                      alt="John"
                                    ></v-img>
                                  </v-avatar>
                                  <p>{{ chipItem.title }}</p>
                                </div>
                              </template>
                            </v-select>
                          </template>
                          <template #bottom> </template>
                          <template
                            #headers="{
                              columns,
                              isSorted,
                              getSortIcon,
                              toggleSort,
                            }"
                          >
                            <tr>
                              <template
                                v-for="column in columns"
                                :key="column.key"
                              >
                                <td class="font-weight-medium bg-grey-darker">
                                  <span
                                    class="mr-2 cursor-pointer"
                                    @click="() => toggleSort(column)"
                                    >{{ column.title }}</span
                                  >
                                  <template v-if="isSorted(column)">
                                    <v-icon
                                      :icon="getSortIcon(column)"
                                    ></v-icon>
                                  </template>
                                </td>
                              </template>
                            </tr>
                          </template>
                        </v-data-table>
                        <div class="d-flex justify-center">
                          <v-btn
                            class="lighten-1 mt-4"
                            color="btn"
                            @click="handleSubmitEditStaffEntriesTable"
                          >
                            確定
                          </v-btn>
                        </div>
                        <div
                          class="block mt-8 head-line"
                          style="border-color: rgba(0, 0, 0, 0.4)"
                        ></div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-dialog>
                <v-btn
                  color="yellow-darken-4"
                  rounded="xl"
                  variant="flat"
                  class="lighten-1 mr-2"
                  :disabled="!isCheckedSelected"
                  @click="handleExportStaffTable"
                >
                  ネームリストCSV出カ
                </v-btn>
              </div>
            </v-toolbar>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              color="btn"
              class="lighten-1 text-capitalize font-weight-regular"
              dark
              prepend-icon="mdi-content-save-outline"
              @click="toStaffDetailPage(item)"
            >
              詳細
            </v-btn>
          </template>
          <template #bottom>
            <div class="text-center pt-2">
              <v-pagination
                v-model="staffTableDataSearch.page"
                :length="staffTableMeta.last_page"
                :total-visible="MAX_PAGE_VISIBLE"
                prev-icon="mdi-chevron-double-left"
                next-icon="mdi-chevron-double-right"
                variant="outlined"
              ></v-pagination>
            </div>
          </template>
        </v-data-table>
        <!-- /.table -->
      </div>
    </div>
  </AdminLayout>
</template>

<script lang="ts" setup>
import { DataTableHeader } from "~/types/component";
import * as validationUtil from "~/utils/validations/fields";

import { useClientStore } from "~/stores/client.module";
import { useProjectStore } from "~/stores/project.module";
import { useReportStore } from "~/stores/report.module";
import { useStaffStore } from "~/stores/staff.module";
import { useAuthStore } from "~/stores/auth.module";
import { useEntrysStore } from "~/stores/entrys.module";
import { useSalarysStore } from "~/stores/salarys.module";
import {
  clientDetailType,
  staffTableDataType,
  projectDetailType,
  SalaryType,
} from "~/types/payload-type";
import {
  projectStatusItems,
  salaryTypeItems,
  SALARY_TYPE,
  projectTypeList,
  levelList,
  DEFAULT_ITEM_PER_PAGE,
  MAX_PAGE_VISIBLE,
} from "~/utils/consts/const";
import {
  convertDateToString,
  convertWageArrayToArrayValue,
  handleReturnErrorMessage,
  convertDateToParams,
} from "~/utils/helpers/helper";
import { useErrorLine } from "~/composables/useErrorLine";

const router = useRouter();
const validation = validationUtil.field;
const clientStore = useClientStore();
const projectStore = useProjectStore();
const reportStore = useReportStore();
const staffStore = useStaffStore();
const authStore = useAuthStore();
const entrysStore = useEntrysStore();
const salaryStore = useSalarysStore();

const debounce = useDebounce(500);

const thisProjectId = computed(() =>
  parseInt(router.currentRoute.value.query.id as string),
);

const columnsTable: DataTableHeader[] = [
  { title: "氏名", value: "name", key: "name" },
  { title: "住所", value: "address", key: "address" },
  { title: "TEL", value: "tel", key: "tel" },
  { title: "給与総額（円）", value: "wage", key: "wage" },
  {
    title: "キャンセル数",
    value: "cancel",
    key: "cancel",
  },
  { title: "ステータス", value: "status", key: "status" },
  { title: "", value: "actions", sortable: false, key: "actions" },
];

const columnsDialogTable: DataTableHeader[] = [
  { title: "作業日", value: "date", key: "date" },
  { title: "起床", value: "wake_up_time", key: "wake_up_time" },
  { title: "出発", value: "departure_time", key: "departure_time" },
  { title: "開始", value: "work_time", key: "work_time" },
  { title: "終了", value: "end_work_time", key: "end_work_time" },
  { title: "レベル", value: "level", key: "level" },
  { title: "時給（円）", value: "unit_price", key: "unit_price" },
  { title: "売上", value: "earnings", key: "earnings" },
  { title: "交通費", value: "travel_expenses", key: "travel_expenses" },
  { title: "休憩(hrs)", value: "hours", key: "hours" },
  { title: "支払い方法", value: "payment_type", key: "payment_type" },
  { title: "給与区分", value: "classification", key: "classification" },
  { title: "備考", value: "notes", key: "notes" },
];

const columnsDialogFormTable: DataTableHeader[] = [
  { title: "作業日", value: "date", key: "date" },
  {
    title: "スタッフ選択",
    value: "staff",
    sortable: false,
    key: "staff",
    width: "80%",
  },
];

const paymentMethodItems = [
  { title: "Day", value: "1" },
  { title: "Week", value: "2" },
  { title: "Month", value: "3" },
];

const salaryMethodItems = [
  { title: "Hour", value: "1" },
  { title: "Day", value: "2" },
];

const dialogTableDataList: Ref<any[]> = ref([]);
const loadingClients = ref(false);
const loadingClientDetail = ref(false);

const validEdit = ref(true);
const validMailBody = ref(true);
const validSearchForm = ref(true);

const startDayInput = ref(new Date());
const endDayInput = ref(new Date());
const salaryHour: Ref<(string | number)[]> = ref([]);
const salaryDayInput: Ref<(string | number)[]> = ref([]);
const originalSalaryHour: Ref<SalaryType[]> = ref([]);
const originalSalaryDay: Ref<SalaryType[]> = ref([]);
const originalSalaryList: Ref<SalaryType[]> = ref([]);

const dataForm = ref({} as projectDetailType);

const dialogTableDataDate = ref({
  start_day: new Date(),
  end_day: new Date(),
});

const getOriginalDataSalary = (typeValue: number) => {
  const originalDataSalaryFilterByType = dataForm.value.salary.filter(
    (item) => {
      if (typeof item.type === "string") {
        return parseInt(item.type) === typeValue;
      }
      return item.type === typeValue;
    },
  );
  return originalDataSalaryFilterByType;
};

const setOriginalValuesAfterFetch = (res: any) => {
  dialogTableDataDate.value.start_day = new Date(res.data.start_day);
  dialogTableDataDate.value.end_day = new Date(res.data.end_day);
  originalSalaryList.value = res.data.salary || [];
  originalSalaryHour.value = getOriginalDataSalary(SALARY_TYPE.HOUR.value);
  salaryHour.value = convertWageArrayToArrayValue(originalSalaryHour.value);
  originalSalaryDay.value = getOriginalDataSalary(SALARY_TYPE.DAY.value);
  salaryDayInput.value = convertWageArrayToArrayValue(originalSalaryDay.value);
};

const getProjectData = async () => {
  const res = await projectStore.getDetail(thisProjectId.value);
  if (res && res.success) {
    dataForm.value = res.data;
    setOriginalValuesAfterFetch(res);
  }
};

watch(
  () => dataForm.value.start_day,
  (value) => {
    startDayInput.value = new Date(value);
  },
);
watch(
  () => dataForm.value.end_day,
  (value) => {
    endDayInput.value = new Date(value);
  },
);

watch(
  () => startDayInput.value,
  (value) => {
    dataForm.value.start_day = convertDateToString(value);
  },
);

watch(
  () => endDayInput.value,
  (value) => {
    dataForm.value.end_day = convertDateToString(value);
  },
);

watch(
  () => dataForm.value.type,
  (value) => {
    if (typeof value === "string") {
      dataForm.value.type = projectTypeList.find(
        (item: { title: string; value: number }) => {
          return item.title === value || item.value === parseInt(value);
        },
      )?.value;
    }
  },
);

watch(
  () => dataForm.value.status,
  (value) => {
    if (typeof value === "string") {
      dataForm.value.status = projectStatusItems.find((item) => {
        return item.title === value || item.value === parseInt(value);
      })?.value;
    }
  },
);

const removeAllSalary = (typeValue: number) => {
  dataForm.value.salary = dataForm.value.salary.filter((item) => {
    if (typeof item.type === "string") {
      return parseInt(item.type) !== typeValue;
    }
    return item.type !== typeValue;
  });
};

const updateSalaryIntoDataForm = (typeValue: number) => {
  let originalDataSalaryFilterByType = originalSalaryHour.value;
  if (typeValue === SALARY_TYPE.DAY.value) {
    originalDataSalaryFilterByType = originalSalaryDay.value;
  }
  const salaryInputValue =
    typeValue === SALARY_TYPE.HOUR.value ? salaryHour : salaryDayInput;
  salaryInputValue.value.forEach((item: string | number, index) => {
    dataForm.value.salary.push({
      id: originalDataSalaryFilterByType[index]?.id ?? null,
      wage: item,
      type: typeValue,
    });
  });
};

watch(
  () => salaryHour.value,
  (value) => {
    removeAllSalary(SALARY_TYPE.HOUR.value);
    updateSalaryIntoDataForm(SALARY_TYPE.HOUR.value);
  },
);

watch(
  () => salaryDayInput.value,
  (value) => {
    removeAllSalary(SALARY_TYPE.DAY.value);
    updateSalaryIntoDataForm(SALARY_TYPE.DAY.value);
  },
);

// client
const clientList: Ref<clientDetailType[]> = ref([]);

const clientSelectList = computed(() => {
  if (!clientList.value) return [];
  return clientList.value.map((item: clientDetailType) => {
    return {
      title: item.name,
      value: item.id || 0,
    };
  });
});

const currentClient = ref<clientDetailType>();

watch(
  () => dataForm.value.client_id,
  (value) => {
    getCLientDetail(value);
  },
);

const getClients = async () => {
  loadingClients.value = true;
  const params = {
    q: "",
    status: "",
  };
  const res = await clientStore.getAll(params);
  if (res && res.success) {
    clientList.value = res.body.data;
  }
  loadingClients.value = false;
};

const getCLientDetail = async (id: number) => {
  loadingClientDetail.value = true;
  const res = await clientStore.getDetail(id);
  loadingClientDetail.value = false;
  if (res && res.success) {
    currentClient.value = res.data;
    dataForm.value.client_code = currentClient.value?.code || "";
    dataForm.value.client_name = currentClient.value?.name || "";
  }
};

const submitEditProjectDialogLoading = ref({
  isLoading: false,
  isShowDialog: false,
  isSuccessful: false,
  message: "",
});

const setSuccessDialogHandleSubmitEditProject = (
  value: boolean,
  text: string,
) => {
  submitEditProjectDialogLoading.value.isSuccessful = value;
  submitEditProjectDialogLoading.value.message = text;
};

const startLoadingDialogHandleSubmitEditProject = () => {
  submitEditProjectDialogLoading.value.isShowDialog = true;
  submitEditProjectDialogLoading.value.isLoading = true;
};

const endLoadingDialogHandleSubmitEditProject = () => {
  submitEditProjectDialogLoading.value.isLoading = false;
  setTimeout(() => {
    submitEditProjectDialogLoading.value.isShowDialog = false;
  }, 1000);
};

const handleSubmitRemoveSalary = async (res: any) => {
  const salaryRemovedIdList = originalSalaryList.value.filter((item) => {
    return (
      item.id &&
      !dataForm.value.salary.find((salaryItem) => salaryItem.id === item.id)
    );
  });
  if (salaryRemovedIdList.length <= 0) {
    return;
  }
  const promisesRemove = salaryRemovedIdList.map((workDayItem) => {
    const workDayIdItem = workDayItem.id;
    if (workDayIdItem) {
      return salaryStore.removeSalaryById(workDayIdItem);
    }
    return Promise.resolve({ success: true, message: "" });
  });
  await Promise.all(promisesRemove)
    .then((resRemove) => {
      if (resRemove.length <= 0) {
        return;
      }
      // use for loop instead of map to break loop when error
      for (const item of resRemove) {
        if (!item.success) {
          res.message = handleReturnErrorMessage(
            item,
            "給与の削除に失敗しました",
          );
          res.success = false;
          break;
        }
      }
    })
    .catch(() => {
      res.message = "給与の削除に失敗しました";
      res.success = false;
    });
};

const handleSubmitEditProject = async () => {
  const payload = dataForm.value;
  startLoadingDialogHandleSubmitEditProject();
  const res = await projectStore.update(thisProjectId.value, payload);
  await handleSubmitRemoveSalary(res);
  endLoadingDialogHandleSubmitEditProject();
  if (res && res.success) {
    setSuccessDialogHandleSubmitEditProject(true, "更新しました。");
    getProjectData();
    return;
  }
  setSuccessDialogHandleSubmitEditProject(
    false,
    handleReturnErrorMessage(res, "更新に失敗しました。"),
  );
};

// mail section
const mailForm = ref({
  subject: "",
  content: "",
});

const templateItems = [
  {
    title: "テンプレート1",
    value: 1,
    subject: "テンプレート1 title",
    content: "テンプレート1 content",
  },
  {
    title: "テンプレート2",
    value: 2,
    subject: "テンプレート2 title",
    content: "テンプレート2 content",
  },
  {
    title: "テンプレート3",
    value: 3,
    subject: "テンプレート3 title",
    content: "テンプレート3 content",
  },
];

const staffStatusItems = [
  {
    title: "作業中",
    value: "3",
  },
  {
    title: "欠勤",
    value: "4",
  },
  {
    title: "作業完了",
    value: "5",
  },
  // {
  //   title: "給料支払い済み",
  //   value: "4",
  // },
];

const templateForm = ref({
  template_id: undefined,
  subject: "",
  content: "",
});

const selected: Ref<number[]> = ref([]);

watch(
  () => templateForm.value.template_id,
  (value) => {
    const selectedTemplate = templateItems.find((item) => item.value === value);
    templateForm.value.subject = selectedTemplate?.subject ?? "";
    templateForm.value.content = selectedTemplate?.content ?? "";
  },
);

const handleApplyTemplate = () => {
  mailForm.value.subject = templateForm.value.subject;
  mailForm.value.content = templateForm.value.content;
};

const mailErrorLine = useErrorLine();

const handleSendMail = async () => {
  const payload = {
    id_staff: selected.value,
    title: mailForm.value.subject,
    content: mailForm.value.content,
  };
  const res = await authStore.sendMailToListIdStaff(payload);
  if (res && res.success) {
    mailErrorLine.setDataErrorLine("メールを送信しました。", true);
    return;
  }
  mailErrorLine.setDataErrorLine(res?.message, false);
};

// staff table section
const staffTableDataSearch: Ref<{
  q: string;
  entry_status: string;
  start_day: string | Date;
  end_day: string | Date;
  page: number;
  per_page: number;
}> = ref({
  q: "",
  entry_status: "",
  start_day: "",
  end_day: "",
  page: 1,
  per_page: DEFAULT_ITEM_PER_PAGE,
});

const staffTableMeta = ref({
  count: 0,
  last_page: 0,
  links: {
    next: "",
    prev: "",
  },
  total: 0,
  count_all: 0,
  count_work: 0,
  count_waiting: 0,
});

// report detail table
const staffTableRPDetail = ref({
  id: "",
  start_day: new Date(),
  end_day: new Date(),
});

const isCheckedSelected = computed(() => {
  return selected.value.length > 0;
});
const tableButtonActive = ref(1);

const toggleButtonButtonActive = (value: number) => {
  tableButtonActive.value = value;
  if (value === 1) {
    staffTableDataSearch.value.entry_status = "";
    return;
  }
  if (value === 2) {
    staffTableDataSearch.value.entry_status = "work"; // work
    return;
  }
  if (value === 3) {
    staffTableDataSearch.value.entry_status = "waiting"; // waiting
  }
};
const checkButtonActive = (value: number) => {
  return tableButtonActive.value === value;
};

const staffTableData: Ref<staffTableDataType[]> = ref([]);
const staffTableLoading = ref(false);
const staffTableErrorLine = useErrorLine();

const isStaffTableHaveAccepted = computed(() => {
  return staffTableMeta.value.count_work > 0;
});

const getDataStaffTable = async () => {
  const params = {
    start_day: convertDateToParams(staffTableDataSearch.value.start_day),
    end_day: convertDateToParams(staffTableDataSearch.value.end_day),
    q: staffTableDataSearch.value.q,
    entry_status: staffTableDataSearch.value.entry_status,
    page: staffTableDataSearch.value.page,
    per_page: staffTableDataSearch.value.per_page,
  };
  staffTableLoading.value = true;
  const res = await projectStore.getDetailListStaff(
    thisProjectId.value,
    params,
  );
  staffTableLoading.value = false;
  if (!res && !res.success) {
    staffTableData.value = [];
    staffTableErrorLine.setDataErrorLine(res?.message, false);
    return;
  }
  staffTableData.value = res.body.data || [];
  const meta = res.body.meta || {};
  if (meta.current_page > meta.last_page) {
    staffTableDataSearch.value.page = meta.last_page || 1;
  }
  staffTableMeta.value = meta;
};

const handleAcceptStaffToProject = async () => {
  const payload = {
    id_staff: selected.value,
  };
  const res = await projectStore.acceptStaffToProject(
    thisProjectId.value,
    payload,
  );
  if (res && res.success) {
    staffTableErrorLine.setDataErrorLine("成功", true);
    getDataStaffTable();
    return;
  }
  staffTableErrorLine.setDataErrorLine(res?.message, false);
};

const handleSearchStaffTable = () => {
  getDataStaffTable();
};

watch(
  () => staffTableDataSearch.value.page,
  () => {
    getDataStaffTable();
  },
);

watch(
  () => staffTableDataSearch.value.entry_status,
  () => {
    getDataStaffTable();
  },
);

const handleExportStaffTable = async () => {
  if (selected.value.length === 0) {
    return;
  }
  await staffStore.download(selected.value);
};

const toStaffDetailPage = (item: any) => {
  const id = item.key;
  router.push({
    path: "/admin/staff/detail",
    query: {
      id,
    },
  });
};

// dialog level 1 section - dialog table
const dialogTable = ref(false);
const isDone = ref(false);
const dialogTableErrorLine = useErrorLine();
const selectedDialogTable = ref([]);
const dialogEarning = ref(false);
const staffChangeStatus: Ref<any> = ref();

const handleReturnItemValue = (item: any) => {
  return item.id;
};

const dialogTableSearch = ref({
  id: "",
  start_day: new Date(),
  end_day: new Date(),
});

const staffAcceptedList: Ref<any[]> = ref([]);
const staffIdleList: Ref<any[]> = ref([]);

const handleDialogTableSearch = async () => {
  const params = {
    staff_id: staffTableRPDetail.value.id,
    start_day: convertDateToString(staffTableRPDetail.value.start_day),
    end_day: convertDateToString(staffTableRPDetail.value.end_day),
  };
  const res = await reportStore.getListReportStaff(thisProjectId.value, params);
  if (res.success) {
    dialogTableDataList.value = res.data;
  }
};
const handleDialogTableAddSalary = () => {};

const dialogTableConfirmDialog = ref(false);

const oldStatusValues: Ref<{ id: number; status: number }[]> = ref([]);
const isCanShowDialog = ref(false);

const fetchDataDialogTable = () => {
  // fetching, the api is not ready yet so set timeout to 1s
  setTimeout(() => {
    isCanShowDialog.value = true;
  }, 1000);
};

watch(
  () => dialogTable.value,
  (value) => {
    if (value) {
      isCanShowDialog.value = false;
      fetchDataDialogTable();
    }
  },
);

oldStatusValues.value = dialogTableDataList.value.map((item: any) => {
  return {
    id: item.staff_id ? item.staff_id : null,
    status: item.status ? item.status : null,
  };
});

const handleChangeStatusDialogTableStatus = (value: any, item: any) => {
  if (value !== item.entry_status && isCanShowDialog.value) {
    staffChangeStatus.value = item;
    statusStaffOld.value = item.entry_status;
    statusStaffNow.value = value;
    item.entry_status = value;
    dialogTableConfirmDialog.value = true;
  }
};

const handleSubmitChangeStatusStaffDialogTable = async () => {
  const payload = {
    status: statusStaffNow.value,
  };

  const res = await entrysStore.update(
    staffChangeStatus.value.entry_id,
    payload,
  );
  if (res && res.success) {
    dialogTableConfirmDialog.value = false;
  }
};

const handleRollbackChangeStatusDialogTable = () => {
  const staff: any = dialogTableDataList.value.find(
    (item: any) => item.entry_id === staffChangeStatus.value.entry_id,
  );
  if (staff) {
    staff.entry_status = statusStaffOld.value;
  }

  dialogTableConfirmDialog.value = false;
};

const handleToggleDialogEarning = async (id: any) => {
  dialogEarning.value = !dialogEarning.value;
  if (dialogEarning.value) {
    const payload = {
      report_id: id,
    };
    const res = await reportStore.getListFee(id, payload);
    if (res.success) {
      const itemOthers = res.data.find((item: any) => item.type === "1");
      const itemAdvance = res.data.find((item: any) => item.type === "2");
      const itemExpenses = res.data.find((item: any) => item.type === "3");
      const data = {
        others: itemOthers.fee,
        othersID: itemOthers.id,
        advance: itemAdvance.fee,
        advanceID: itemAdvance.id,
        expenses: itemExpenses.fee,
        expensesID: itemExpenses.id,
        id,
      };
      dialogEarningForm.value = data;
    }
  }
};

const dialogEarningForm = ref({
  others: 0,
  othersID: 0,
  advance: 0,
  advanceID: 0,
  expenses: 0,
  expensesID: 0,
  id: 0,
});

const handleSubmitEarning = async () => {
  const payload = {
    report_id: dialogEarningForm.value.id,
    fees: [
      {
        id: dialogEarningForm.value.othersID,
        fee: dialogEarningForm.value.others,
      },
      {
        id: dialogEarningForm.value.advanceID,
        fee: dialogEarningForm.value.advance,
      },
      {
        id: dialogEarningForm.value.expensesID,
        fee: dialogEarningForm.value.expenses,
      },
    ],
  };
  const res = await reportStore.updateFee(payload.report_id, payload);
  dialogEarning.value = !dialogEarning.value;
};

const handleSubmitEarningAndCalculateSalary = async () => {
  // calculate salary
  await handleSubmitEarning();
  const el = document.getElementsByClassName(
    `earning-${dialogEarningForm.value.id}`,
  )[0];
  const res = await reportStore.calculateSalary(dialogEarningForm.value.id, {});
  if (res.success) {
    el.innerHTML = res.data.data?.earnings;
  }
};

// dialog level 2 section - dialog form
const dialogForm = ref(false);
const dialogFormLoading = ref(false);
const dialogFormErrorLine = useErrorLine();
const dialogFormSearch = computed(() => {
  return {
    start_date: dialogTableDataDate.value.start_day,
    end_date: dialogTableDataDate.value.end_day,
  };
});

const handleDialogFormSearch = () => {
  if (
    dialogFormSearch.value.start_date < dialogTableDataDate.value.start_day ||
    dialogFormSearch.value.end_date > dialogTableDataDate.value.end_day
  ) {
    dialogFormErrorLine.setDataErrorLine(
      "日付はプロジェクトの開始日と終了日の範囲内で入力してください。",
      false,
    );
    return;
  }
  dialogFormErrorLine.setDataErrorLine("", true);
  getDialogFormDataEntryTable(true);
};

interface EntryTableDataType {
  date: string;
  staff: Array<{
    work_day_id: number;
    name: string;
  }>;
}

const staffListToSelect: Ref<
  {
    entry_id: number;
    name: string;
    date: Array<{
      date: string;
    }>;
  }[]
> = ref([]);
const dialogFormData: Ref<EntryTableDataType[]> = ref([]);
const dialogFormDataOriginal: Ref<EntryTableDataType[]> = ref([]);

const getDialogFormEntryStaffList = async () => {
  dialogFormLoading.value = true;
  const res = await entrysStore.getEntriesStaffListByProjectId(
    thisProjectId.value,
  );
  dialogFormLoading.value = false;
  if (res && res.success) {
    if (res.data == null) {
      staffListToSelect.value = [];
      dialogFormErrorLine.setDataErrorLine(
        "まだスタッフを受け入れていないため、表示できるものはありません",
        false,
      );
      return;
    }
    staffListToSelect.value = res.data;
    return;
  }
  dialogFormErrorLine.setDataErrorLine(res?.message ?? "", false);
};

const updateReport = async (item: any, newVal: any, key: string) => {
  const data: any = {};
  data[key] = newVal;
  const el = document.getElementsByClassName(`earning-${item.raw.id}`)[0];
  const res = await reportStore.updateDetailAdmin(item.raw.id, data);
  if (res.success) {
    el.innerHTML = res.data?.earnings || 0;
  }
};

const getDialogFormDataEntryTable = async (isSearch = false) => {
  const payload = {
    start_day: convertDateToString(dialogFormSearch.value.start_date, "-"),
    end_day: convertDateToString(dialogFormSearch.value.end_date, "-"),
  };
  dialogFormLoading.value = true;
  const res = await entrysStore.getAllEntriesByProjectId(
    thisProjectId.value,
    isSearch ? payload : {},
  );
  dialogFormLoading.value = false;
  if (res && res.success) {
    dialogFormData.value = res.data;
    dialogFormDataOriginal.value = JSON.parse(JSON.stringify(res.data));
    getDialogFormEntryStaffList();
    return;
  }
  dialogFormErrorLine.setDataErrorLine(res?.message ?? "", false);
};

const handleToggleDialogForm = () => {
  dialogForm.value = !dialogForm.value;
  if (dialogForm.value) {
    getDialogFormDataEntryTable();
  }
};

const trimOldEntriesWhichDateSmallerThanToday = (
  input: EntryTableDataType[],
) => {
  const dateNow = new Date();
  dateNow.setHours(0, 0, 0, 0);
  const newData = input.filter((item: any) => {
    const date = new Date(item.date);
    date.setHours(0, 0, 0, 0);
    return date >= dateNow;
  });
  return newData;
};

const handleCalculateStaffRemove = () => {
  const dialogFormDataTrimmed = trimOldEntriesWhichDateSmallerThanToday(
    dialogFormData.value,
  );
  const dialogFormDataOriginalTrimmed = trimOldEntriesWhichDateSmallerThanToday(
    dialogFormDataOriginal.value,
  );
  const removedWorkDayList: number[] = [];
  const changesRemoved = dialogFormDataOriginalTrimmed.filter((item) => {
    const originalItem = dialogFormDataTrimmed.find(
      (originalItem) => originalItem.date === item.date,
    );
    if (!originalItem) {
      return true;
    }
    const staffChangesRemove = item.staff.filter((staffItem) => {
      const originalStaffItem = originalItem.staff.find(
        (originalStaffItem) =>
          originalStaffItem.work_day_id === staffItem.work_day_id,
      );
      if (!originalStaffItem) {
        return true;
      }
      return false;
    });
    if (staffChangesRemove.length > 0) {
      staffChangesRemove.forEach((staffItem) => {
        removedWorkDayList.push(staffItem.work_day_id);
      });
      return true;
    }
    return false;
  });
  return removedWorkDayList;
};

const statusStaffNow = ref();
const statusStaffOld = ref();

const handleCalculateStaffAdd = () => {
  const dialogFormDataTrimmed = trimOldEntriesWhichDateSmallerThanToday(
    dialogFormData.value,
  );
  const dialogFormDataOriginalTrimmed = trimOldEntriesWhichDateSmallerThanToday(
    dialogFormDataOriginal.value,
  );
  const staffChangesAdd: Array<{
    entry_id: number;
    date: string;
  }> = [];
  const changesAdd = dialogFormDataTrimmed.filter((newDataRow) => {
    const originalItem = dialogFormDataOriginalTrimmed.find(
      (originalItemRow) => originalItemRow.date === newDataRow.date,
    );
    if (!originalItem) {
      return true;
    }
    const arrStaffChangeInRow: any[] = newDataRow.staff.filter((staffItem) => {
      const originalStaff = originalItem.staff.find(
        (originalStaffItem) => originalStaffItem.name === staffItem.name,
      );
      if (!originalStaff) {
        return true;
      }
      return false;
    });
    if (arrStaffChangeInRow.length > 0) {
      arrStaffChangeInRow.forEach((item) => {
        staffChangesAdd.push({
          entry_id: item.entry_id as number,
          date: newDataRow.date,
        });
      });
      return true;
    }
    if (staffChangesAdd.length > 0) {
      return true;
    }
    return false;
  });
  return staffChangesAdd;
};

const handleSubmitEditStaffEntriesTable = async () => {
  const changesAdd = handleCalculateStaffAdd();
  const changesRemoved = handleCalculateStaffRemove();
  const payload = changesAdd;
  if (changesAdd.length === 0 && changesRemoved.length === 0) {
    dialogFormErrorLine.setDataErrorLine("変更がありません。", false);
    return;
  }
  if (changesAdd.length > 0) {
    const res = await entrysStore.addStaffToWorkDayList(
      thisProjectId.value,
      payload,
    );
    if (res && res.success) {
      dialogFormErrorLine.setDataErrorLine("", true);
    } else {
      dialogFormErrorLine.setDataErrorLine(res?.message ?? "", false);
    }
  }
  if (changesRemoved.length > 0) {
    const promisesRemove = changesRemoved.map((workDayIdItem) => {
      return entrysStore.removeEntryByIdWorkday(workDayIdItem);
    });
    await Promise.all(promisesRemove)
      .then((resRemove) => {
        if (resRemove.length <= 0) {
          return;
        }
        resRemove.forEach((item) => {
          if (item && item.success) {
            return;
          }
          dialogFormErrorLine.setDataErrorLine(item?.message ?? "", false);
        });
      })
      .catch(() => {
        dialogFormErrorLine.setDataErrorLine("削除に失敗しました。", false);
      });
  }
  getDialogFormDataEntryTable();
};

function validStatus(value: any) {
  if (value && value.entry_status !== "4" && value.entry_status !== "5") {
    return false;
  }
  return true;
}

function validConfirmSalary(value: any) {
  if (value && value.entry_status !== "4") {
    return false;
  }
  return true;
}

const handleDisableComboboxSelectStaff = (staffItem: any) => {
  if (staffListToSelect.value.length === 0) {
    return true;
  }
  const date = new Date(staffItem.raw.date);
  const dateNow = new Date();
  date.setHours(0, 0, 0, 0);
  dateNow.setHours(0, 0, 0, 0);
  return date < dateNow;
};

const getDataReport = async () => {
  // reset value
  isDone.value = false;
  staffAcceptedList.value = [];
  staffIdleList.value = [];
  staffTableRPDetail.value.start_day = new Date(dataForm.value.start_day);
  staffTableRPDetail.value.end_day = new Date(dataForm.value.end_day);
  // get data
  const lisReport = await reportStore.getListReportStaff(
    thisProjectId.value,
    null,
  );
  const listStaffWork = await reportStore.getListStaffInProject(
    thisProjectId.value,
  );
  const listStaffIdle = await reportStore.getListStaffIdleProject(
    thisProjectId.value,
  );

  Promise.all([lisReport, listStaffWork, listStaffIdle])
    .then((result) => {
      if (result) {
        dialogTableDataList.value = lisReport.data;
        listStaffWork.data.forEach((item: any) => {
          staffAcceptedList.value.push({
            value: item.staff_id,
            title: item.name,
          });
        });

        listStaffIdle.data.forEach((item: any) => {
          staffIdleList.value.push({
            value: item.staff_id,
            title: item.name,
          });
        });
        isDone.value = true;
      }
    })
    .catch((error) => console.log(error));
};

onMounted(() => {
  getClients();
  getProjectData();
  getDataStaffTable();
});
</script>
