<template>
  <AdminLayout>
    <div class="rounded-lg bg-white p-30">
      <h3>給料一覧</h3>
      <h5 class="mb-4 font-weight-regular">
        このプロジェクトに応募いただいたスタッフの一覧です。
      </h5>
      <!-- /.title head-->

      <v-row align="center" class="mt-4 mb-6">
        <v-col cols="3">
          <InputField
            name="案件名"
            :model-value="searchParams.project_name"
            hide-details
            @update:model-value="searchParams.project_name = $event"
          />
        </v-col>
        <v-col cols="3">
          <InputField
            name="取引先名"
            :model-value="searchParams.staff_name"
            hide-details
            @update:model-value="searchParams.staff_name = $event"
          />
        </v-col>
        <v-col cols="3">
          <DatePicker
            title="生年月日"
            :model-value="searchParams.start_day"
            @update:model-value="searchParams.start_day = $event"
          />
        </v-col>
        <v-col cols="3">
          <DatePicker
            title="日付"
            :model-value="searchParams.end_day"
            @update:model-value="searchParams.end_day = $event"
          />
        </v-col>
        <v-col cols="2">
          <v-btn color="btn" class="lighten-1" dark> 登録 </v-btn>
        </v-col>
      </v-row>
      <ErrorLine
        :message="errorLine.message.value"
        :success="errorLine.isSuccess.value"
      />
      <v-switch
        v-model="switcher"
        hide-details
        inset
        :label="`By: ${switcherText}`"
      ></v-switch>
      <v-data-table
        ref="table"
        v-model="selected"
        :headers="columns"
        :items="data"
        :group-by="groupBy"
        show-select
        hide-default-footer
        item-key="no"
        :item-value="(item) => handleReturnItemValue(item)"
        class="custom-table"
        is-group-open
      >
        <!-- <template
          #headers="{
            columns,
            isSorted,
            getSortIcon,
            toggleSort,
            allSelected,
            selectAll,
          }"
        >
          <tr>
            <template v-for="column in columns" :key="column.key">
              <td v-if="column.key === 'data-table-select'">
                <v-checkbox
                  :value="allSelected"
                  color="black"
                  hide-details
                  @click="selectAll"
                ></v-checkbox>
              </td>
              <td v-if="column.key === 'data-table-group'">
                <div class="d-flex align-center"></div>
              </td>
              <td v-else>
                <span
                  class="mr-2 cursor-pointer"
                  @click="() => toggleSort(column)"
                  >{{ column.title }}</span
                >
                <template v-if="isSorted(column)">
                  <v-icon :icon="getSortIcon(column)"></v-icon>
                </template>
              </td>
            </template>
          </tr>
        </template> -->
        <template #data-table-group="item">
          <td>
            <div class="text-center d-flex align-center">
              <v-btn
                variant="plain"
                class="text-decoration-underline text-blue"
                @click="handleOpenDialog(item)"
              >
                {{ handleReturnValue(item) }}
              </v-btn>
              <v-btn
                variant="plain"
                class="table-expand-group-btn"
                icon
                @click="item.props.onClick"
              >
                <v-icon>mdi-arrow-right</v-icon></v-btn
              >
            </div>
          </td>
        </template>
        <template v-if="switcherText === 'Project'" #column.project_name>
        </template>
        <template v-if="switcherText === 'Project'" #item.project_name>
        </template>
        <template v-if="switcherText === 'Staff'" #column.staff_name>
        </template>
        <template v-if="switcherText === 'Staff'" #item.staff_name> </template>
        <template #bottom>
          <div class="text-center pt-2">
            <v-pagination
              v-model="searchParams.page"
              :length="meta.last_page"
              prev-icon="mdi-chevron-double-left"
              next-icon="mdi-chevron-double-right"
              variant="outlined"
              :total-visible="MAX_PAGE_VISIBLE"
            ></v-pagination>
          </div>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog">
        <v-card class="rounded-lg p-30 overflow-auto">
          <v-card-title class="mb-1">
            <h3>{{ dialogData.name }}</h3>
            <h5 class="font-weight-regular">
              スタッフの給与状況を確認できます。
            </h5>
          </v-card-title>
          <v-card-text class="p-2">
            <ErrorLine
              :message="dialogErrorLine.message.value"
              :success="dialogErrorLine.isSuccess.value"
            />
            <div
              v-for="(dialogListTableItem, idx) in dialogListTableData"
              :key="idx"
            >
              <div class="d-flex align-center mb-4 mt-1">
                <h4>{{ dialogListTableItem.name }}</h4>
                <v-btn
                  rounded="xl"
                  color="indigo-darken-4"
                  variant="flat"
                  class="lighten-1 ml-auto"
                  @click="handleSubmitDialog(dialogListTableItem)"
                >
                  + 支払済
                </v-btn>
              </div>
              <div>
                <v-data-table
                  :headers="dialogTableColumns"
                  :items="dialogListTableItem.data"
                  hide-default-footer="true"
                  disable-pagination
                  item-key="no"
                  class="custom-table striped-table table-dark-header"
                  :item-value="(item) => `${item.id}`"
                  :loading="dialogTableLoading"
                  show-select
                >
                  <template #[`item.payment_amount`]="{ item }">
                    <v-btn
                      class="text-decoration-underline opacity-1 text-left p-0"
                      variant="plain"
                      color="blue"
                      :disabled="handleDisableToggleDialogPaymentBtn(item)"
                      @click="handleToggleDialogPaymentAmount(item)"
                    >
                      {{ item.raw.payment_amount }}
                    </v-btn>
                  </template>
                  <template #bottom> </template>
                </v-data-table>
                <div
                  class="block mt-8 head-line"
                  style="border-color: rgba(0, 0, 0, 0.4)"
                ></div>
              </div>
            </div>
            <v-dialog v-model="dialogPaymentAmount">
              <v-card class="rounded-lg p-30 overflow-auto mx-10">
                <v-card-title class="mb-2">
                  <h2>Dialog fee</h2>
                  <h4 class="h4-title font-weight-regular">Dialog fee</h4>
                </v-card-title>
                <v-card-text class="p-2">
                  <InputField
                    name="給与"
                    :model-value="dialogPaymentAmountForm.salary"
                    :rules="validation.number"
                    class="mb-2"
                    @update:model-value="
                      dialogPaymentAmountForm.salary = $event
                    "
                  />
                  <InputField
                    class="mb-2"
                    name="その他控除（ー）"
                    :model-value="dialogPaymentAmountForm.other_deductions"
                    :rules="validation.number"
                    @update:model-value="
                      dialogPaymentAmountForm.other_deductions = $event
                    "
                  />
                  <InputField
                    :rules="validation.number"
                    class="mb-2"
                    name="事務手数料（ー）"
                    :model-value="dialogPaymentAmountForm.administrative_fee"
                    @update:model-value="
                      dialogPaymentAmountForm.administrative_fee = $event
                    "
                  />
                  <v-btn
                    class="lighten-1 mt-4"
                    color="btn"
                    @click="handleSubmitDialogPaymentAmountForm"
                  >
                    検索
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </AdminLayout>
</template>

<script lang="ts" setup>
import { DataTableHeader, SortItem } from "~/types/component";
import * as validationUtil from "~/utils/validations/fields";
import { useProjectStore } from "~/stores/project.module";
import { MAX_PAGE_VISIBLE, DEFAULT_ITEM_PER_PAGE } from "~/utils/consts/const";

const projectStore = useProjectStore();

const validation = ref(validationUtil.field);

const table = ref(null);
const columns: DataTableHeader[] = [
  { title: "案件名", value: "project_name", key: "project_name" },
  { title: "氏名", value: "staff_name", key: "staff_name" },
  { title: "支払金額", value: "payment_amount", key: "payment_amount" },
  { title: "ステータス", value: "status", key: "status" },
  { title: "確定日", value: "fixed_date", key: "fixed_date" },
  { title: "銀行", value: "bank", key: "bank" },
  { title: "支店", value: "branch", key: "branch" },
  { title: "口座番号", value: "account_number", key: "account_number" },
];

const errorLine = useErrorLine();
const dialogErrorLine = useErrorLine();

const switcher = ref(true);
const switcherText = computed(() => (switcher.value ? "Project" : "Staff"));
const groupBy: Ref<SortItem[]> = ref([{ key: "project_name", order: "asc" }]);

const handleExpandAllTableGroup = () => {
  const expandBtnList = document.querySelectorAll<HTMLElement>(
    ".table-expand-group-btn",
  );
  expandBtnList.forEach((btn) => {
    btn.click();
  });
};

watch(switcher, (val) => {
  if (val) {
    groupBy.value = [{ key: "project_name", order: "asc" }];
  } else {
    groupBy.value = [{ key: "staff_name", order: "asc" }];
  }
  handleExpandAllTableGroup();
});

const dialog = ref(false);

const data = [
  {
    project_name: "project_A",
    project_id: "1",
    staff_name: "staff_1",
    staff_id: "1",
    payment_amount: "100,000",
    status: "未払い",
    fixed_date: "2021/04/23",
    bank: "三井住友銀行",
    branch: "渋谷支店",
    account_number: "1234567",
  },
  {
    project_name: "project_A",
    project_id: "1",
    staff_id: "2",
    staff_name: "staff_2",
    payment_amount: "100,000",
    status: "未払い",
    fixed_date: "2021/04/23",
    bank: "三井住友銀行",
    branch: "渋谷支店",
    account_number: "1234567",
  },
  {
    project_name: "project_A",
    project_id: "1",
    staff_name: "staff_3",
    staff_id: "3",
    payment_amount: "100,000",
    status: "未払い",
    fixed_date: "2021/04/23",
    bank: "三井住友銀行",
    branch: "渋谷支店",
    account_number: "1234567",
  },
  {
    project_id: "2",
    project_name: "project_B",
    staff_name: "staff_1",
    staff_id: "1",
    payment_amount: "100,000",
    status: "未払い",
    fixed_date: "2021/04/23",
    bank: "三井住友銀行",
    branch: "渋谷支店",
    account_number: "1234567",
  },
  {
    project_id: "2",
    project_name: "project_B",
    staff_id: "2",
    staff_name: "staff_2",
    fixed_date: "2021/04/23",
    bank: "三井住友銀行",
    branch: "渋谷支店",
    account_number: "1234567",
  },
  {
    staff_id: "3",
    project_id: "2",
    project_name: "project_B",
    staff_name: "staff_3",
    fixed_date: "2021/04/23",
    bank: "三井住友銀行",
    branch: "渋谷支店",
    account_number: "1234567",
  },
];

const meta = ref({
  count: 0,
  last_page: 1,
  links: {
    next: "",
    prev: "",
  },
  total: 0,
});

const searchParams = reactive({
  start_day: "",
  end_day: "",
  page: 1,
  per_page: DEFAULT_ITEM_PER_PAGE,
  project_name: "",
  staff_name: "",
});

const selected = ref([]);

const dialogData: Ref<{
  name: string;
  type: "project" | "staff";
  id: number;
}> = ref({
  name: "",
  type: "project",
  id: 0,
});
const dialogErrorMessage = ref("");
const dialogTableLoading = ref(false);

const dialogTableColumns: DataTableHeader[] = [
  { title: "勤務日", value: "working_day", key: "working_day" },
  { title: "レベル", value: "level", key: "level" },
  { title: "単価（円）", value: "unit_price", key: "unit_price" },
  { title: "売上", value: "payment_amount", key: "payment_amount" },
  { title: "支払い方法", value: "payment_method", key: "payment_method" },
  { title: "給与区分", value: "salary_class", key: "salary_class" },
  { title: "支払日", value: "payment_day", key: "payment_day" },
];

const dialogListTableDataWhenStaffCLicked = [
  {
    name: "project_A",
    data: [
      {
        id: 1,
        working_day: "2021/04/23",
        level: "A",
        unit_price: "100,000",
        payment_amount: "100,000",
        payment_method: "日払い",
        salary_class: "月給",
        payment_day: "2021/04/23",
        checked: false,
      },
      {
        id: 2,
        working_day: "2021/04/23",
        level: "A",
        unit_price: "100,000",
        payment_amount: "100,000",
        payment_method: "日払い",
        salary_class: "月給",
        payment_day: "2021/04/23",
        checked: false,
      },
      {
        id: 3,
        working_day: "2021/04/23",
        level: "A",
        unit_price: "100,000",
        payment_amount: "100,000",
        payment_method: "日払い",
        salary_class: "月給",
        payment_day: "2021/04/23",
        checked: false,
      },
    ],
  },
  {
    name: "project_B",
    data: [
      {
        id: 4,
        working_day: "2021/04/23",
        level: "A",
        unit_price: "100,000",
        payment_amount: "100,000",
        payment_method: "日払い",
        salary_class: "月給",
        payment_day: "2021/04/23",
        checked: false,
      },
      {
        id: 5,
        working_day: "2021/04/23",
        level: "A",
        unit_price: "100,000",
        payment_amount: "100,000",
        payment_method: "日払い",
        salary_class: "月給",
        payment_day: "2021/04/23",
        checked: false,
      },
      {
        id: 6,
        working_day: "2021/04/23",
        level: "A",
        unit_price: "100,000",
        payment_amount: "100,000",
        payment_method: "日払い",
        salary_class: "月給",
        payment_day: "2021/04/23",
        checked: false,
      },
    ],
  },
];

const dialogListTableDataWhenProjectCLicked = [
  {
    name: "staff_A",
    data: [
      {
        id: 1,
        working_day: "2021/04/23",
        level: "A",
        unit_price: "100,000",
        payment_amount: "100,000",
        payment_method: "日払い",
        salary_class: "月給",
        payment_day: "2021/04/23",
        checked: false,
      },
      {
        id: 2,
        working_day: "2021/04/23",
        level: "A",
        unit_price: "100,000",
        payment_amount: "100,000",
        payment_method: "日払い",
        salary_class: "月給",
        payment_day: "2021/04/23",
        checked: false,
      },
      {
        id: 3,
        working_day: "2021/04/23",
        level: "A",
        unit_price: "100,000",
        payment_amount: "100,000",
        payment_method: "日払い",
        salary_class: "月給",
        payment_day: "2021/04/23",
        checked: false,
      },
    ],
  },
  {
    name: "staff_B",
    data: [
      {
        id: 4,
        working_day: "2021/04/23",
        level: "A",
        unit_price: "100,000",
        payment_amount: "100,000",
        payment_method: "日払い",
        salary_class: "月給",
        payment_day: "2021/04/23",
        checked: false,
      },
      {
        id: 5,
        working_day: "2021/04/23",
        level: "A",
        unit_price: "100,000",
        payment_amount: "100,000",
        payment_method: "日払い",
        salary_class: "月給",
        checked: false,
        payment_day: "2021/04/23",
      },
      {
        id: 6,
        working_day: "2021/04/23",
        level: "A",
        unit_price: "100,000",
        payment_amount: "100,000",
        payment_method: "日払い",
        salary_class: "月給",
        checked: false,
        payment_day: "2021/04/23",
      },
    ],
  },
];

const dialogListTableData = ref(dialogListTableDataWhenStaffCLicked);

const handleClg = (item: any) => {
  console.log(item);
  return item;
};

const handleReturnItemValue = (item: any) => {
  return `${item.project_id}-${item.staff_id}`;
};

const handleReturnValue = (item: any) => {
  return item.item.value;
};

const handleOpenDialog = (item: any) => {
  dialog.value = true;
  if (switcherText.value === "Project") {
    dialogData.value.type = "project";
    dialogData.value.id = item.item.items[0].raw.project_id;
    dialogData.value.name = item.item.items[0].raw.project_name;
    return;
  }
  dialogData.value.type = "staff";
  dialogData.value.id = item.item.items[0].raw.staff_id;
  dialogData.value.name = item.item.items[0].raw.staff_name;
};

watch(
  dialogData,
  (val) => {
    if (val.type === "project") {
      dialogListTableData.value = dialogListTableDataWhenProjectCLicked;
      return;
    }
    dialogListTableData.value = dialogListTableDataWhenStaffCLicked;
  },
  {
    immediate: true,
    deep: true,
  },
);

const dialogPaymentAmount = ref(false);
const dialogPaymentAmountForm = ref({
  salary: 0,
  other_deductions: 0,
  administrative_fee: 0,
});

const originalDialogListTableSelectedItems: Ref<number[]> = ref([]);

const getDataDialogListTable = async () => {
  dialogTableLoading.value = true;
  const res = await projectStore.getDetail(dialogData.value.id);
  dialogTableLoading.value = false;
  if (res && res.success) {
    dialogListTableData.value = res.data;
    dialogListTableData.value.forEach((item) => {
      item.data.forEach((subItem) => {
        subItem.checked = !!subItem.checked;
      });
    });
    originalDialogListTableSelectedItems.value = dialogListTableData.value
      .map((item) => {
        return item.data
          .filter((subItem) => subItem.checked)
          .map((subItem) => subItem.id);
      })
      .flat();
    return;
  }
  dialogErrorMessage.value = res?.message ?? "";
};

const handleDisableToggleDialogPaymentBtn = (item: any) => {
  const id = item.raw.id;
  if (originalDialogListTableSelectedItems.value.length === 0) {
    return false;
  }
  return originalDialogListTableSelectedItems.value.includes(id);
};

const handleToggleDialogPaymentAmount = (item: any) => {
  dialogPaymentAmount.value = !dialogPaymentAmount.value;
};

const handleSubmitDialogPaymentAmountForm = () => {};

const handleSubmitDialog = (dialogListTableItem: any) => {};

onMounted(() => {
  handleExpandAllTableGroup();
});
</script>
