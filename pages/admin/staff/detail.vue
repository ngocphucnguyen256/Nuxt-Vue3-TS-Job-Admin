<template>
  <AdminLayout>
    <div class="rounded-lg bg-white p-30">
      <h4 class="h4-title pl-10 mb-4">スタッフ情報</h4>
      <v-form ref="form" v-model="valid" lazy-validation class="px-10">
        <v-row>
          <v-col cols="6">
            <InputField
              name="氏名"
              :model-value="dataForm.name"
              :readonly="true"
              @update:model-value="dataForm.name = $event"
          /></v-col>
          <v-col cols="6">
            <InputField
              name="ふりがな"
              :model-value="dataForm.furigana"
              :readonly="true"
              @update:model-value="dataForm.furigana = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <InputField
              name="生年月日"
              :model-value="dataForm.birthday"
              :readonly="true"
              @update:model-value="dataForm.birthday = $event"
            />
          </v-col>
          <v-col cols="6">
            <InputField
              name="住所"
              :model-value="dataForm.address"
              :readonly="true"
              @update:model-value="dataForm.address = $event"
          /></v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <InputField
              name="性別"
              :model-value="dataForm.gender"
              :readonly="true"
              @update:model-value="dataForm.gender = $event"
            />
          </v-col>
          <v-col cols="6">
            <InputField
              name="電話番号"
              :model-value="dataForm.tel"
              :readonly="true"
              @update:model-value="dataForm.tel = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <InputField
              name="口座情報"
              :model-value="dataForm.bank_info"
              :readonly="true"
              @update:model-value="dataForm.bank_info = $event"
            />
          </v-col>
          <v-col cols="6">
            <InputField
              name="LINE"
              :model-value="dataForm.line"
              :readonly="true"
              @update:model-value="dataForm.line = $event"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <InputField
              name="Mail"
              :model-value="dataForm.email"
              :readonly="true"
              @update:model-value="dataForm.email = $event"
          /></v-col>
          <v-col cols="6">
            <InputField
              name="メインの連絡先"
              :model-value="dataForm.contact"
              :readonly="true"
              @update:model-value="dataForm.contact = $event"
          /></v-col>
        </v-row>

        <v-btn color="blue-grey" dark class="mt-6" @click="() => router.back()">
          キャンセル
        </v-btn>
      </v-form>

      <!-- /.form-->
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { useStaffStore } from "~/stores/staff.module";
import { StaffType } from "~/types/payload-type";
import { genderList } from "~/utils/consts/const";

const store = useStaffStore();
const router = useRouter();

const valid = ref(true);
const dataForm: Ref<StaffType> = ref({} as StaffType);

const getData = async () => {
  const id = parseInt(router.currentRoute.value.query.id as string);
  const res = await store.getDetail(id);
  if (res && res.success) {
    dataForm.value = res.data;
  }
};

watch(
  () => dataForm.value.gender,
  (value) => {
    dataForm.value.gender = genderList.find(
      (item: { title: string; value: number }) => {
        return item.title === value || item.value === value;
      },
    )?.title;
  },
);

onMounted(() => {
  getData();
});
</script>
