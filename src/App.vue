<template>
  <div class="mbti-app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="nav-container">
        <div 
          class="nav-item" 
          :class="{ active: navActive === 'start' }"
          @click="navActive = 'start'"
        >
          开始测试
        </div>
        <div 
          class="nav-item" 
          :class="{ active: navActive === 'intro' }"
          @click="navActive = 'intro'"
        >
          MBTI
        </div>
        <div 
          class="nav-item" 
          :class="{ active: navActive === 'self-assess' }"
          @click="navActive = 'self-assess'"
        >
          自评
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 1. 开始测试页面（包含题数选择） -->
      <div v-if="navActive === 'start'" class="page start-page">
        <el-card class="card" shadow="hover">
          <!-- <h2 class="page-title">MBTI 性格测试</h2> -->
          <div v-if="!questionCount" class="count-select">
            <p class="desc">选择测试题目数量（题数越多，结果越接近真实）</p>
            <div class="count-buttons">
              <el-button 
                v-for="count in [30, 93,100]" 
                :key="count"
                :class="{ 'count-btn': true, active: selectedCount === count }"
                @click="selectedCount = count"
              >
                {{ count }}题
              </el-button>
            </div>
            <el-button 
              type="primary" 
              size="large" 
              class="start-btn"
              :disabled="!selectedCount"
              @click="startTest"
            >
              开始{{ selectedCount }}题测试
            </el-button>
          </div>

          <!-- 答题区域 -->
          <div v-else-if="step >= 1 && step <= questionCount" class="question-page">
            <div style="display: flex; justify-content: flex-end; width: 100vw; padding: 10px;"></div>
              <el-button type="text" @click="resetTest">重置</el-button>
           
            <h3 class="question-title">第 {{ step }} 题 / 共 {{ questionCount }} 题</h3>
            <el-progress 
              :percentage="progress" 
              :stroke-width="6" 
              status="success" 
              class="progress" 
            />
          
            <p class="question-content">{{ currentQuestion?.question || '题目加载中...' }}</p>

            <div class="options">
              <div
                v-for="(opt, i) in currentQuestion?.options || []"
                :key="i"
                :class="['opt-item', select === i ? 'selected' : '']"
                @click="choose(i)"
              >
                {{ opt.label }}
              </div>
            </div>

            <div class="btns">
              <el-button :disabled="step === 1" @click="prev">上一题</el-button>
              <el-button 
                type="primary" 
                :disabled="select === -1" 
                @click="next"
              >
                {{ step === questionCount ? '看结果' : '下一题' }}
              </el-button>
            </div>
          </div>

          <!-- 测试结果页 -->
          <div v-else-if="step > questionCount" class="result-page">
            <h2 class="result-title">你的MBTI类型：<span class="type">{{ result }}</span></h2>
            <div class="tendency">
 <div class="tendency-item">E/I |{{ (result && result.length >=1) ? result[0] : '-' }} 倾向：{{ tendency.EI }}%</div>
<div class="tendency-item">S/N |{{ (result && result.length >=2) ? result[1] : '-' }} 倾向：{{ tendency.SN }}%</div>
<div class="tendency-item">T/F |{{ (result && result.length >=3) ? result[2] : '-' }} 倾向：{{ tendency.TF }}%</div>
<div class="tendency-item">J/P |{{ (result && result.length >=4) ? result[3] : '-' }} 倾向：{{ tendency.JP }}%</div>
            </div>
              <br>
              <img :src="`/src/assets/avatars/${result}.svg`" alt="MBTI类型图标" class="type-icon"/>
              <br>
            <div class="desc">{{ resultText }}</div>
            <el-button type="primary" @click="resetTest">重新测试</el-button>
          </div>
        </el-card>
      </div>

      <!-- 2. 了解MBTI页面 -->
      <div v-if="navActive === 'intro'" class="page intro-page">
        <el-card class="card" shadow="hover">
          <h2 class="page-title">什么是MBTI？</h2>
          <div class="intro-content">
            <p class="intro-desc">
              MBTI（迈尔斯-布里格斯类型指标）是基于卡尔·荣格的心理类型理论发展而来的人格测评工具，
              它将人格分为4个核心维度，每个维度有两个对立的倾向，组合成16种人格类型。
            </p>

            <!-- 四个维度介绍 -->
            <div class="dimensions">
              <div class="dimension-item">
                <h3>🔹 精力来源：E（外向）- I（内向）</h3>
                <p>外向(E)：从与他人互动中获取能量，喜欢社交、表达自己</p>
                <p>内向(I)：从独处中获取能量，喜欢思考、深度交流</p>
              </div>
              <div class="dimension-item">
                <h3>🔹 认知方式：S（实感）- N（直觉）</h3>
                <p>实感(S)：关注具体事实、细节、当下的实际情况</p>
                <p>直觉(N)：关注抽象概念、可能性、未来的发展趋势</p>
              </div>
              <div class="dimension-item">
                <h3>🔹 决策方式：T（思考）- F（情感）</h3>
                <p>思考(T)：基于逻辑、客观分析、公平原则做决定</p>
                <p>情感(F)：基于他人感受、人际关系、价值观做决定</p>
              </div>
              <div class="dimension-item">
                <h3>🔹 生活方式：J（判断）- P（知觉）</h3>
                <p>判断(J)：喜欢计划、秩序、确定性，倾向于快速做决定</p>
                <p>知觉(P)：喜欢灵活、即兴、可能性，倾向于保留选择空间</p>
              </div>
            </div>

            <!-- 16型人格简要说明 -->
            <div class="personality-types">
              <h3>16种人格类型分类</h3>
              <div class="type-group">
                <div class="type-item">分析家：INTJ、INTP、ENTJ、ENTP</div>
                <div class="type-item">外交家：INFJ、INFP、ENFJ、ENFP</div>
                <div class="type-item">守护者：ISTJ、ISFJ、ESTJ、ESFJ</div>
                <div class="type-item">探险家：ISTP、ISFP、ESTP、ESFP</div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 3. 跳过测试自评页面 -->
      <div v-if="navActive === 'self-assess'" class="page self-assess-page">
        <el-card class="card" shadow="hover">
          <h2 class="page-title">MBTI 自评</h2>
          <p class="desc">根据自身情况选择倾向，生成你的MBTI类型</p>

          <div class="assess-form">
            <!-- E/I维度 -->
            <div class="assess-item">
              <h4>精力来源：</h4>
              <el-slider
                v-model="assessScores.EI"
                :min="0"
                :max="100"
                :marks="{ 0: '极端内向(I)', 50: '平衡', 100: '极端外向(E)' }"
                class="slider"
              />
              <p class="assess-tip">当前倾向：{{ assessScores.EI >= 50 ? `外向(E)(${assessScores.EI}%)` : `内向(I)(${100-assessScores.EI}%)` }}</p>
            </div>

            <!-- S/N维度 -->
            <div class="assess-item">
              <h4>认知方式：</h4>
              <el-slider
                v-model="assessScores.SN"
                :min="0"
                :max="100"
                :marks="{ 0: '极端直觉(N)', 50: '平衡', 100: '极端实感(S)' }"
                class="slider"
              />
              <p class="assess-tip">当前倾向：{{ assessScores.SN >= 50 ? `实感(S)(${assessScores.SN}%)` : `直觉(N)(${100-assessScores.SN}%)` }}</p>
            </div>

            <!-- T/F维度 -->
            <div class="assess-item">
              <h4>决策方式：</h4>
              <el-slider
                v-model="assessScores.TF"
                :min="0"
                :max="100"
                :marks="{ 0: '极端情感(F)', 50: '平衡', 100: '极端思考(T)' }"
                class="slider"
              />
              <p class="assess-tip">当前倾向：{{ assessScores.TF >= 50 ? `思考(T)(${assessScores.TF}%)` : `情感(F)(${100-assessScores.TF}%)` }}</p>
            </div>

            <!-- J/P维度 -->
            <div class="assess-item">
              <h4>生活方式：</h4>
              <el-slider
                v-model="assessScores.JP"
                :min="0"
                :max="100"
                :marks="{ 0: '极端知觉(P)', 50: '平衡', 100: '极端判断(J)' }"
                class="slider"
              />
              <p class="assess-tip">当前倾向：{{ assessScores.JP >= 50 ? `判断(J)(${assessScores.JP}%)` : `知觉(P)(${100-assessScores.JP}%)` }}</p>
            </div>

            <el-button 
              type="primary" 
              size="large" 
              class="generate-btn"
              @click="generateSelfAssessResult"
            >
              生成自评结果
            </el-button>

            <!-- 自评结果展示 -->
            <div v-if="selfAssessResult" class="self-assess-result">
              <h3>你的自评MBTI类型：<span class="type">{{ selfAssessResult }}</span></h3>
              <br>
              <img :src="`/src/assets/avatars/${selfAssessResult}.svg`" alt="MBTI类型图标" class="type-icon"/>
              <br>
              <div class="desc">{{ resultText }}</div>
            </div>
          </div>
        </el-card>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
// 确保Element Plus组件正确引入
import { ElCard, ElButton, ElProgress, ElSlider, ElMessage } from 'element-plus'

// ========== 全局状态 ==========
const navActive = ref('start')
const selectedCount = ref(0)
const questionCount = ref(0)
const step = ref(0)
const select = ref(-1)
const userAnswers = ref([])
const assessScores = ref({ EI: 50, SN: 50, TF: 50, JP: 50 })
// 随机后的题目列表
const shuffledQuestions = ref([])
const selfAssessResult = ref('')

// ========== 先定义各维度基础题库（解决嵌套引用问题） ==========
// E/I维度题库（24题：核心4+普通20）
const eiQuestions = [
  // 核心题 weight=2
  {
    question: "社交活动后，你通常会感到精力更充沛，还是更疲惫？",
    options: [
      { label: "精力更充沛，喜欢与人互动", score: { E:1, I:0 } },
      { label: "精力疲惫，需要独处恢复", score: { E:0, I:1 } }
    ],
    weight: 2
  },
  {
    question: "你更习惯边说边思考，还是先想清楚再开口？",
    options: [
      { label: "边说边思考，表达帮助我理清思路", score: { E:1, I:0 } },
      { label: "先想清楚，再决定是否表达", score: { E:0, I:1 } }
    ],
    weight: 2
  },
  {
    question: "认识新朋友时，你通常更主动还是更被动？",
    options: [
      { label: "更主动，愿意开启话题", score: { E:1, I:0 } },
      { label: "更被动，等对方先开口", score: { E:0, I:1 } }
    ],
    weight: 2
  },
  {
    question: "你更愿意成为人群中的焦点，还是安静的观察者？",
    options: [
      { label: "成为焦点，带动气氛", score: { E:1, I:0 } },
      { label: "安静观察，不引人注目", score: { E:0, I:1 } }
    ],
    weight: 2
  },
  // 普通题 weight=1
  {
    question: "空闲时你更喜欢和朋友一起，还是独自度过？",
    options: [
      { label: "和朋友聚会、外出", score: { E:1, I:0 } },
      { label: "独自休息、做自己的事", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "遇到问题时，你更倾向找人讨论，还是自己琢磨？",
    options: [
      { label: "找人讨论，获得不同观点", score: { E:1, I:0 } },
      { label: "自己琢磨，独立解决", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你更喜欢多人团队活动，还是一对一深入交流？",
    options: [
      { label: "多人团队活动", score: { E:1, I:0 } },
      { label: "一对一深入交流", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你更容易快速和陌生人熟络，还是需要时间熟悉？",
    options: [
      { label: "快速熟络", score: { E:1, I:0 } },
      { label: "需要时间熟悉", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你更擅长表达自己，还是倾听别人？",
    options: [
      { label: "表达自己", score: { E:1, I:0 } },
      { label: "倾听别人", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你更习惯公开表达观点，还是私下表达？",
    options: [
      { label: "公开表达", score: { E:1, I:0 } },
      { label: "私下表达", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你喜欢热闹的环境，还是安静的环境？",
    options: [
      { label: "热闹环境", score: { E:1, I:0 } },
      { label: "安静环境", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你更容易在行动中思考，还是在安静中思考？",
    options: [
      { label: "行动中思考", score: { E:1, I:0 } },
      { label: "安静中思考", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否需要频繁的社交互动来保持状态？",
    options: [
      { label: "需要，社交让我有活力", score: { E:1, I:0 } },
      { label: "不需要，独处更舒服", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你在团队中更愿意主动发言，还是默默配合？",
    options: [
      { label: "主动发言、主导讨论", score: { E:1, I:0 } },
      { label: "默默配合、执行为主", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否觉得独处太久会感到无聊？",
    options: [
      { label: "是的，需要找人聊天", score: { E:1, I:0 } },
      { label: "不是，独处很舒服", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你更愿意参加大型派对，还是小型聚会？",
    options: [
      { label: "大型派对、认识更多人", score: { E:1, I:0 } },
      { label: "小型聚会、深度交流", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否容易和别人建立表面关系，而非深度关系？",
    options: [
      { label: "是的，朋友多但深交少", score: { E:1, I:0 } },
      { label: "不是，朋友少但都是深交", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你更愿意通过聊天放松，还是通过独处放松？",
    options: [
      { label: "聊天放松", score: { E:1, I:0 } },
      { label: "独处放松", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否喜欢成为别人关注的中心？",
    options: [
      { label: "喜欢，享受被关注", score: { E:1, I:0 } },
      { label: "不喜欢，避免被关注", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
  question: "和人聊天结束后，你常会回味刚才的对话，还是很快就放下？",
  options: [
    { label: "很快放下，不太往心里去", score: { E:1, I:0 } },
    { label: "会回味很久，容易想多", score: { E:0, I:1 } }
  ],
  weight: 1
},
  {
    question: "你是否会在社交前准备话题，还是临场发挥？",
    options: [
      { label: "准备话题、更有把握", score: { E:1, I:0 } },
      { label: "临场发挥、更自然", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否觉得独处是“浪费时间”？",
    options: [
      { label: "是的，不如社交有意义", score: { E:1, I:0 } },
      { label: "不是，独处是充电", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你更愿意主动组织活动，还是被邀请参加活动？",
    options: [
      { label: "主动组织", score: { E:1, I:0 } },
      { label: "被邀请参加", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你更擅长在多人场合找话题，还是一对一聊天？",
    options: [
      { label: "多人场合找话题", score: { E:1, I:0 } },
      { label: "一对一深度聊天", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
    question: "你更愿意打电话沟通，还是发消息沟通？",
    options: [
      { label: "打电话、即时沟通", score: { E:1, I:0 } },
      { label: "发消息、有思考时间", score: { E:0, I:1 } }
    ],
    weight: 1
  },
  {
  question: "你更常因为“想得太多”而累，还是因为“做得太多”而累？",
  options: [
    { label: "做得太多", score: { E:1, I:0 } },
    { label: "想得太多", score: { E:0, I:1 } }
  ],
  weight: 1
  },
]

// S/N维度题库（24题：核心4+普通20）
const snQuestions = [
  // 核心题 weight=2
  {
    question: "你更关注现实细节，还是未来可能性？",
    options: [
      { label: "现实细节、看得见的事实", score: { S:1, N:0 } },
      { label: "未来可能性、灵感与想象", score: { S:0, N:1 } }
    ],
    weight: 2
  },
  {
    question: "学习新事物时，你更看重实用方法，还是底层原理？",
    options: [
      { label: "实用方法、直接能用", score: { S:1, N:0 } },
      { label: "底层原理、整体逻辑", score: { S:0, N:1 } }
    ],
    weight: 2
  },
  {
    question: "你更相信经验，还是直觉？",
    options: [
      { label: "经验，实际经历更可靠", score: { S:1, N:0 } },
      { label: "直觉，灵感更有价值", score: { S:0, N:1 } }
    ],
    weight: 2
  },
  {
    question: "你更喜欢具体明确的事，还是抽象创意的事？",
    options: [
      { label: "具体明确、可落地", score: { S:1, N:0 } },
      { label: "抽象创意、有想象空间", score: { S:0, N:1 } }
    ],
    weight: 2
  },
  {
  question: "你更擅长把复杂事情讲简单，还是把简单事情讲深入？",
  options: [
    { label: "讲简单、抓重点", score: { S:1, N:0 } },
    { label: "讲深入、挖本质", score: { S:0, N:1 } }
  ],
  weight: 2
 },
  // 普通题 weight=1
  {
    question: "描述事情时，你更倾向写实，还是比喻？",
    options: [
      { label: "写实、讲清楚事实", score: { S:1, N:0 } },
      { label: "比喻、讲意境和感觉", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更擅长记住具体事件，还是整体模式？",
    options: [
      { label: "具体事件、细节", score: { S:1, N:0 } },
      { label: "整体模式、规律", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更喜欢实际动手操作，还是构思规划？",
    options: [
      { label: "实际动手操作", score: { S:1, N:0 } },
      { label: "构思规划、想象", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更关注“是什么”，还是“可能成为什么”？",
    options: [
      { label: "关注现在是什么", score: { S:1, N:0 } },
      { label: "关注未来可能成为什么", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更喜欢已知稳定的事，还是未知新鲜的事？",
    options: [
      { label: "已知稳定、有把握", score: { S:1, N:0 } },
      { label: "未知新鲜、有挑战", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更像务实派，还是理想派？",
    options: [
      { label: "务实派", score: { S:1, N:0 } },
      { label: "理想派", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更容易注意到环境变化，还是忽略细节？",
    options: [
      { label: "注意到环境细节变化", score: { S:1, N:0 } },
      { label: "忽略细节，关注整体", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更喜欢纪实内容，还是幻想创意内容？",
    options: [
      { label: "纪实、现实向", score: { S:1, N:0 } },
      { label: "幻想、创意向", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更关注具体的应用，还是抽象的理论？",
    options: [
      { label: "具体应用", score: { S:1, N:0 } },
      { label: "抽象理论", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更关注具体的数字，还是抽象的概念？",
    options: [
      { label: "具体数字、数据", score: { S:1, N:0 } },
      { label: "抽象概念、理念", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更容易记住别人的名字，还是别人说的话的核心意思？",
    options: [
      { label: "记住名字、具体细节", score: { S:1, N:0 } },
      { label: "记住核心意思、整体逻辑", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更喜欢按部就班学习，还是跳跃式学习？",
    options: [
      { label: "按部就班、循序渐进", score: { S:1, N:0 } },
      { label: "跳跃式、抓重点", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更关注眼前的任务，还是长远的目标？",
    options: [
      { label: "眼前任务、先做完再说", score: { S:1, N:0 } },
      { label: "长远目标、看整体方向", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更喜欢实际的礼物，还是有创意的礼物？",
    options: [
      { label: "实际的、能用的", score: { S:1, N:0 } },
      { label: "有创意的、有心意的", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更擅长处理具体的问题，还是抽象的问题？",
    options: [
      { label: "具体问题、看得见摸得着", score: { S:1, N:0 } },
      { label: "抽象问题、需要思考的", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更相信眼见为实，还是相信直觉判断？",
    options: [
      { label: "眼见为实、看到才相信", score: { S:1, N:0 } },
      { label: "直觉判断、感觉更准", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更关注事物的现状，还是未来的潜力？",
    options: [
      { label: "现状、实际情况", score: { S:1, N:0 } },
      { label: "潜力、发展空间", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更擅长记住事实，还是记住想法？",
    options: [
      { label: "记住事实、具体信息", score: { S:1, N:0 } },
      { label: "记住想法、抽象概念", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更喜欢描述细节，还是总结概括？",
    options: [
      { label: "描述细节、讲清楚过程", score: { S:1, N:0 } },
      { label: "总结概括、讲核心结论", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更关注事物的实用性，还是可能性？",
    options: [
      { label: "实用性、能用来做什么", score: { S:1, N:0 } },
      { label: "可能性、能发展成什么", score: { S:0, N:1 } }
    ],
    weight: 1
  },
  {
    question: "你更像“细节控”，还是“大局观”？",
    options: [
      { label: "细节控、关注小处", score: { S:1, N:0 } },
      { label: "大局观、关注整体", score: { S:0, N:1 } }
    ],
    weight: 1
  }
]

// T/F维度题库（22题：核心4+普通18）
const tfQuestions = [
  // 核心题 weight=2
  {
    question: "做决定时，你更看重逻辑客观，还是人情感受？",
    options: [
      { label: "逻辑客观、公平原则", score: { T:1, F:0 } },
      { label: "人情感受、关系和谐", score: { T:0, F:1 } }
    ],
    weight: 2
  },
  {
    question: "批评别人时，你更看重真实直接，还是委婉照顾情绪？",
    options: [
      { label: "真实直接、对事不对人", score: { T:1, F:0 } },
      { label: "委婉照顾、不让对方难堪", score: { T:0, F:1 } }
    ],
    weight: 2
  },
  {
    question: "你更被认为理性冷静，还是温暖体贴？",
    options: [
      { label: "理性冷静、讲原则", score: { T:1, F:0 } },
      { label: "温暖体贴、重感情", score: { T:0, F:1 } }
    ],
    weight: 2
  },
  {
    question: "解决冲突时，你优先讲道理，还是优先顾关系？",
    options: [
      { label: "优先讲道理、分清对错", score: { T:1, F:0 } },
      { label: "优先顾关系、维持和谐", score: { T:0, F:1 } }
    ],
    weight: 2
  },
  {
  question: "做选择时，你更相信“事实证明”，还是“感觉没错”？",
  options: [
    { label: "事实证明", score: { T:1, F:0 } },
    { label: "感觉没错", score: { T:0, F:1 } }
  ],
  weight: 2
},
{
  question: "你更在意“把事做对”，还是“把关系处好”？",
  options: [
    { label: "把事做对", score: { T:1, F:0 } },
    { label: "把关系处好", score: { T:0, F:1 } }
  ],
  weight: 2
},
// 普通题 weight=1
{
  question: "别人情绪不好时，你会先理性分析，还是先安抚情绪？",
  options: [
    { label: "先理性分析", score: { T:1, F:0 } },
    { label: "先安抚情绪", score: { T:0, F:1 } }
  ],
  weight: 1
},
  {
    question: "你更容易被逻辑说服，还是被情感打动？",
    options: [
      { label: "被逻辑说服", score: { T:1, F:0 } },
      { label: "被情感打动", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你更看重事情是否正确，还是大家是否开心？",
    options: [
      { label: "事情是否正确", score: { T:1, F:0 } },
      { label: "大家是否开心", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "别人求助时，你先给方案，还是先给安慰？",
    options: [
      { label: "先给解决方案", score: { T:1, F:0 } },
      { label: "先给情绪安慰", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你更欣赏客观坦率，还是圆滑周到？",
    options: [
      { label: "客观坦率", score: { T:1, F:0 } },
      { label: "圆滑周到", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "做选择时，你更靠分析，还是靠感觉？",
    options: [
      { label: "靠分析判断", score: { T:1, F:0 } },
      { label: "靠内心感觉", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你更容易忽视别人情绪，还是过度在意情绪？",
    options: [
      { label: "忽视情绪、专注问题", score: { T:1, F:0 } },
      { label: "在意情绪、怕伤害人", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你更认同“对事不对人”，还是“先照顾人再谈事”？",
    options: [
      { label: "对事不对人", score: { T:1, F:0 } },
      { label: "先照顾人再谈事", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你做决定时更看重结果，还是过程中的感受？",
    options: [
      { label: "看重结果、效率优先", score: { T:1, F:0 } },
      { label: "看重感受、体验优先", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你更愿意坚持原则，还是妥协让步照顾别人？",
    options: [
      { label: "坚持原则、对错分明", score: { T:1, F:0 } },
      { label: "妥协让步、照顾感受", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你更看重公平，还是宽容？",
    options: [
      { label: "公平、一视同仁", score: { T:1, F:0 } },
      { label: "宽容、因人而异", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否容易因为逻辑漏洞否定一个想法？",
    options: [
      { label: "是的，逻辑不对就不行", score: { T:1, F:0 } },
      { label: "不是，有心意就好", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你更擅长分析问题，还是共情他人？",
    options: [
      { label: "分析问题、找原因", score: { T:1, F:0 } },
      { label: "共情他人、懂感受", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你做决定时更理性，还是更感性？",
    options: [
      { label: "理性、靠分析", score: { T:1, F:0 } },
      { label: "感性、靠感觉", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你更在意自己是否“正确”，还是是否“受欢迎”？",
    options: [
      { label: "在意正确、对事负责", score: { T:1, F:0 } },
      { label: "在意受欢迎、与人和谐", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否觉得“人情世故”很麻烦？",
    options: [
      { label: "是的，不如直接点", score: { T:1, F:0 } },
      { label: "不是，人际关系需要维护", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你更愿意实话实说，还是委婉表达？",
    options: [
      { label: "实话实说、不绕弯子", score: { T:1, F:0 } },
      { label: "委婉表达、照顾情绪", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否会因为别人的感受改变自己的决定？",
    options: [
      { label: "不会，按自己的判断来", score: { T:1, F:0 } },
      { label: "会，考虑别人的感受", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你更看重规则，还是人情？",
    options: [
      { label: "规则、人人平等", score: { T:1, F:0 } },
      { label: "人情、灵活处理", score: { T:0, F:1 } }
    ],
    weight: 1
  },
  {
    question: "你更看重效率，还是人情味？",
    options: [
      { label: "效率、把事做好", score: { T:1, F:0 } },
      { label: "人情味、让人舒服", score: { T:0, F:1 } }
    ],
    weight: 1
  }
]

// J/P维度题库（22题：核心4+普通18）
const jpQuestions = [
  // 核心题 weight=2
  {
    question: "你更喜欢计划确定，还是灵活随缘？",
    options: [
      { label: "计划确定、心里踏实", score: { J:1, P:0 } },
      { label: "灵活随缘、享受变化", score: { J:0, P:1 } }
    ],
    weight: 2
  },
  {
    question: "面对任务，你习惯尽早完成，还是临近截止再冲刺？",
    options: [
      { label: "尽早完成、避免拖延", score: { J:1, P:0 } },
      { label: "临近截止、效率更高", score: { J:0, P:1 } }
    ],
    weight: 2
  },
  {
    question: "你的生活环境更偏向整洁有序，还是随性自然？",
    options: [
      { label: "整洁有序、固定摆放", score: { J:1, P:0 } },
      { label: "随性自然、怎么方便怎么来", score: { J:0, P:1 } }
    ],
    weight: 2
  },
  {
    question: "你更喜欢事情有结论，还是保持开放？",
    options: [
      { label: "有结论、定下来", score: { J:1, P:0 } },
      { label: "保持开放、留余地", score: { J:0, P:1 } }
    ],
    weight: 2
  },
  // 普通题 weight=1
  {
    question: "旅行时你喜欢做攻略，还是说走就走？",
    options: [
      { label: "做好详细攻略", score: { J:1, P:0 } },
      { label: "说走就走、随机应变", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你更喜欢按流程做事，还是即兴发挥？",
    options: [
      { label: "按流程、有秩序", score: { J:1, P:0 } },
      { label: "即兴发挥、自由点", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你更容易焦虑不确定，还是享受不确定？",
    options: [
      { label: "焦虑不确定，喜欢确定", score: { J:1, P:0 } },
      { label: "享受不确定，喜欢惊喜", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你习惯列清单完成任务，还是想到什么做什么？",
    options: [
      { label: "列清单、按计划完成", score: { J:1, P:0 } },
      { label: "想到什么做什么", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你更喜欢提前安排，还是临时决定？",
    options: [
      { label: "提前安排", score: { J:1, P:0 } },
      { label: "临时决定", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你做完事会立刻收尾，还是喜欢拖一会儿？",
    options: [
      { label: "立刻收尾、干净利落", score: { J:1, P:0 } },
      { label: "不急着收尾、放松一下", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你更像规划型，还是随性型？",
    options: [
      { label: "规划型", score: { J:1, P:0 } },
      { label: "随性型", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否喜欢把事情“敲定”，而非“待定”？",
    options: [
      { label: "喜欢敲定、确定下来", score: { J:1, P:0 } },
      { label: "可以待定、留有余地", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否喜欢提前预约，而非临时邀约？",
    options: [
      { label: "喜欢提前预约、有准备", score: { J:1, P:0 } },
      { label: "接受临时邀约、更灵活", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你更愿意把事情做完，还是先留着慢慢做？",
    options: [
      { label: "做完、不拖到后面", score: { J:1, P:0 } },
      { label: "慢慢做、不急于完成", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否讨厌计划被打乱？",
    options: [
      { label: "是的，打乱会焦虑", score: { J:1, P:0 } },
      { label: "不是，随机应变就好", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你更擅长制定计划，还是执行计划？",
    options: [
      { label: "制定计划、规划全局", score: { J:1, P:0 } },
      { label: "执行计划、灵活调整", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你更喜欢有明确的规则，还是灵活的规则？",
    options: [
      { label: "明确规则、有章可循", score: { J:1, P:0 } },
      { label: "灵活规则、因地制宜", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否会提前准备好出行物品，而非临时收拾？",
    options: [
      { label: "提前准备、避免遗漏", score: { J:1, P:0 } },
      { label: "临时收拾、更高效", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你更愿意快速做决定，还是多考虑一会儿？",
    options: [
      { label: "快速做决定、不犹豫", score: { J:1, P:0 } },
      { label: "多考虑、不急于决定", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否喜欢把桌面收拾干净，而非随意摆放？",
    options: [
      { label: "收拾干净、看着舒服", score: { J:1, P:0 } },
      { label: "随意摆放、方便使用", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你是否喜欢“凡事有交代，件件有着落”？",
    options: [
      { label: "喜欢、有闭环", score: { J:1, P:0 } },
      { label: "无所谓、顺其自然", score: { J:0, P:1 } }
    ],
    weight: 1
  },
  {
    question: "你更像“急性子”，还是“慢性子”？",
    options: [
      { label: "急性子、喜欢尽快完成", score: { J:1, P:0 } },
      { label: "慢性子、喜欢慢慢来", score: { J:0, P:1 } }
    ],
    weight: 1
  }
]


const mbti93Questions = [
  // 第一部分1-26题
  {
    question: "当你要外出一整天，你会",
    options: [
      { label: "计划你要做什么和在什么时候做", score: { J: 1, P: 0 } },
      { label: "说去就去", score: { J: 0, P: 1 } }
    ],
    weight: 1
  },
  {
    question: "你认为自己是一个",
    options: [
      { label: "较为随兴所至的人", score: { J: 0, P: 1 } },
      { label: "较为有条理的人", score: { J: 1, P: 0 } }
    ],
    weight: 1
  },
  {
    question: "假如你是一位老师，你会选教",
    options: [
      { label: "以事实为主的课程", score: { S: 1, N: 0 } },
      { label: "涉及理论的课程", score: { S: 0, N: 1 } }
    ],
    weight: 1
  },
  {
    question: "你通常",
    options: [
      { label: "与人容易混熟", score: { E: 1, I: 0 } },
      { label: "比较沉静或矜持", score: { E: 0, I: 1 } }
    ],
    weight: 1
  },
  {
    question: "一般来说，你和哪些人比较合得来？",
    options: [
      { label: "富于想象力的人", score: { S: 0, N: 1 } },
      { label: "现实的人", score: { S: 1, N: 0 } }
    ],
    weight: 1
  },
  {
    question: "你是否经常让",
    options: [
      { label: "你的情感支配你的理智", score: { T: 0, F: 1 } },
      { label: "你的理智主宰你的情感", score: { T: 1, F: 0 } }
    ],
    weight: 1
  },
  {
    question: "处理许多事情上，你会喜欢",
    options: [
      { label: "凭兴所至行事", score: { J: 0, P: 1 } },
      { label: "按照计划行事", score: { J: 1, P: 0 } }
    ],
    weight: 1
  },
  {
    question: "你是否",
    options: [
      { label: "容易让人了解", score: { E: 1, I: 0 } },
      { label: "难于让人了解", score: { E: 0, I: 1 } }
    ],
    weight: 1
  },
  {
    question: "按照程序表做事，",
    options: [
      { label: "合你心意", score: { J: 1, P: 0 } },
      { label: "令你感到束缚", score: { J: 0, P: 1 } }
    ],
    weight: 1
  },
  {
    question: "当你有一份特别的任务，你会喜欢",
    options: [
      { label: "开始前小心组织计划", score: { J: 1, P: 0 } },
      { label: "边做边找须做什么", score: { J: 0, P: 1 } }
    ],
    weight: 1
  },
  {
    question: "在大多数情况下，你会选择",
    options: [
      { label: "顺其自然", score: { J: 0, P: 1 } },
      { label: "按程序表做事", score: { J: 1, P: 0 } }
    ],
    weight: 1
  },
  {
    question: "大多数人会说你是一个",
    options: [
      { label: "重视自我隐私的人", score: { E: 0, I: 1 } },
      { label: "非常坦率开放的人", score: { E: 1, I: 0 } }
    ],
    weight: 1
  },
  {
    question: "你宁愿被人认为是一个",
    options: [
      { label: "实事求是的人", score: { S: 1, N: 0 } },
      { label: "机灵的人", score: { S: 0, N: 1 } }
    ],
    weight: 1
  },
  {
    question: "在一大群人当中，通常是",
    options: [
      { label: "你介绍大家认识", score: { E: 1, I: 0 } },
      { label: "别人介绍你", score: { E: 0, I: 1 } }
    ],
    weight: 1
  },
  {
    question: "你会跟哪些人做朋友？",
    options: [
      { label: "常提出新主意的", score: { S: 0, N: 1 } },
      { label: "脚踏实地的", score: { S: 1, N: 0 } }
    ],
    weight: 1
  },
  {
    question: "你倾向",
    options: [
      { label: "重视感情多于逻辑", score: { T: 0, F: 1 } },
      { label: "重视逻辑多于感情", score: { T: 1, F: 0 } }
    ],
    weight: 1
  },
  {
    question: "你比较喜欢",
    options: [
      { label: "坐观事情发展才作计划", score: { J: 0, P: 1 } },
      { label: "很早就作计划", score: { J: 1, P: 0 } }
    ],
    weight: 1
  },
  {
    question: "你喜欢花很多的时间",
    options: [
      { label: "一个人独处", score: { E: 0, I: 1 } },
      { label: "和别人在一起", score: { E: 1, I: 0 } }
    ],
    weight: 1
  },
  {
    question: "与很多人一起会",
    options: [
      { label: "令你活力倍增", score: { E: 1, I: 0 } },
      { label: "常常令你心力憔悴", score: { E: 0, I: 1 } }
    ],
    weight: 1
  },
  {
    question: "你比较喜欢",
    options: [
      { label: "很早便把约会、社交聚集等事情安排妥当", score: { J: 1, P: 0 } },
      { label: "无拘无束，看当时有什么好玩就做什么", score: { J: 0, P: 1 } }
    ],
    weight: 1
  },
  {
    question: "计划一个旅程时，你较喜欢",
    options: [
      { label: "大部分的时间都是跟当天的感觉行事", score: { J: 0, P: 1 } },
      { label: "事先知道大部分的日子会做什么", score: { J: 1, P: 0 } }
    ],
    weight: 1
  },
  {
    question: "在社交聚会中，你",
    options: [
      { label: "有时感到郁闷", score: { E: 0, I: 1 } },
      { label: "常常乐在其中", score: { E: 1, I: 0 } }
    ],
    weight: 1
  },
  {
    question: "你通常",
    options: [
      { label: "和别人容易混熟", score: { E: 1, I: 0 } },
      { label: "趋向自处一隅", score: { E: 0, I: 1 } }
    ],
    weight: 1
  },
  {
    question: "哪些人会更吸引你？",
    options: [
      { label: "一个思想敏捷及非常聪颖的人", score: { S: 0, N: 1 } },
      { label: "实事求是，具丰富常识的人", score: { S: 1, N: 0 } }
    ],
    weight: 1
  },
  {
    question: "在日常工作中，你会",
    options: [
      { label: "颇为喜欢处理迫使你分秒必争的突发", score: { J: 0, P: 1 } },
      { label: "通常预先计划，以免要在压力下工作", score: { J: 1, P: 0 } }
    ],
    weight: 1
  },
  {
    question: "你认为别人一般",
    options: [
      { label: "要花很长时间才认识你", score: { E: 0, I: 1 } },
      { label: "用很短的时间便认识你", score: { E: 1, I: 0 } }
    ],
    weight: 1
  },
  // 第二部分27-58题（词语二选一）
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "注重隐私", score: { E: 0, I: 1 } },
      { label: "坦率开放", score: { E: 1, I: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "预先安排的", score: { J: 1, P: 0 } },
      { label: "无计划的", score: { J: 0, P: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "抽象", score: { S: 0, N: 1 } },
      { label: "具体", score: { S: 1, N: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "温柔", score: { T: 0, F: 1 } },
      { label: "坚定", score: { T: 1, F: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "思考", score: { T: 1, F: 0 } },
      { label: "感受", score: { T: 0, F: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "事实", score: { S: 1, N: 0 } },
      { label: "意念", score: { S: 0, N: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "冲动", score: { J: 0, P: 1 } },
      { label: "决定", score: { J: 1, P: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "热衷", score: { E: 1, I: 0 } },
      { label: "文静", score: { E: 0, I: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "文静", score: { E: 0, I: 1 } },
      { label: "外向", score: { E: 1, I: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "有系统", score: { J: 1, P: 0 } },
      { label: "随意", score: { J: 0, P: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "理论", score: { S: 0, N: 1 } },
      { label: "肯定", score: { S: 1, N: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "敏感", score: { T: 0, F: 1 } },
      { label: "公正", score: { T: 1, F: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "令人信服", score: { T: 1, F: 0 } },
      { label: "感人的", score: { T: 0, F: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "声明", score: { S: 1, N: 0 } },
      { label: "概念", score: { S: 0, N: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "不受约束", score: { J: 0, P: 1 } },
      { label: "预先安排", score: { J: 1, P: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "矜持", score: { E: 0, I: 1 } },
      { label: "健谈", score: { E: 1, I: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "有条不紊", score: { J: 1, P: 0 } },
      { label: "不拘小节", score: { J: 0, P: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "意念", score: { S: 0, N: 1 } },
      { label: "实况", score: { S: 1, N: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "同情怜悯", score: { T: 0, F: 1 } },
      { label: "远见", score: { T: 1, F: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "利益", score: { T: 1, F: 0 } },
      { label: "祝福", score: { T: 0, F: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "务实的", score: { S: 1, N: 0 } },
      { label: "理论的", score: { S: 0, N: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "朋友不多", score: { E: 0, I: 1 } },
      { label: "朋友众多", score: { E: 1, I: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "有系统", score: { J: 1, P: 0 } },
      { label: "即兴", score: { J: 0, P: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "富想象的", score: { S: 0, N: 1 } },
      { label: "以事论事", score: { S: 1, N: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "亲切的", score: { T: 0, F: 1 } },
      { label: "客观的", score: { T: 1, F: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "客观的", score: { T: 1, F: 0 } },
      { label: "热情的", score: { T: 0, F: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "建造", score: { S: 1, N: 0 } },
      { label: "发明", score: { S: 0, N: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "文静", score: { E: 0, I: 1 } },
      { label: "爱合群", score: { E: 1, I: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "理论", score: { S: 0, N: 1 } },
      { label: "事实", score: { S: 1, N: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "富同情", score: { T: 0, F: 1 } },
      { label: "合逻辑", score: { T: 1, F: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "具分析力", score: { T: 1, F: 0 } },
      { label: "多愁善感", score: { T: 0, F: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "合情合理", score: { S: 1, N: 0 } },
      { label: "令人着迷", score: { S: 0, N: 1 } }
    ],
    weight: 1
  },
  // 第三部分59-78题
  {
    question: "当你要在一个星期内完成一个大项目，你在开始的时候会",
    options: [
      { label: "把要做的不同工作依次列出", score: { J: 1, P: 0 } },
      { label: "马上动工", score: { J: 0, P: 1 } }
    ],
    weight: 1
  },
  {
    question: "在社交场合中，你经常会感到",
    options: [
      { label: "与某些人很难打开话匣儿和保持对话", score: { E: 0, I: 1 } },
      { label: "与多数人都能从容地长谈", score: { E: 1, I: 0 } }
    ],
    weight: 1
  },
  {
    question: "要做许多人也做的事，你比较喜欢",
    options: [
      { label: "按照一般认可的方法去做", score: { S: 1, N: 0 } },
      { label: "构想一个自己的想法", score: { S: 0, N: 1 } }
    ],
    weight: 1
  },
  {
    question: "你刚认识的朋友能否说出你的兴趣？",
    options: [
      { label: "马上可以", score: { E: 1, I: 0 } },
      { label: "要待他们真正了解你之后才可以", score: { E: 0, I: 1 } }
    ],
    weight: 1
  },
  {
    question: "你通常较喜欢的科目是",
    options: [
      { label: "讲授概念和原则的", score: { S: 0, N: 1 } },
      { label: "讲授事实和数据的", score: { S: 1, N: 0 } }
    ],
    weight: 1
  },
  {
    question: "哪个是较高的赞誉，或称许为？",
    options: [
      { label: "一贯感性的人", score: { T: 0, F: 1 } },
      { label: "一贯理性的人", score: { T: 1, F: 0 } }
    ],
    weight: 1
  },
  {
    question: "你认为按照程序表做事",
    options: [
      { label: "有时是需要的，但一般来说你不大喜欢这样做", score: { J: 0, P: 1 } },
      { label: "大多数情况下是有帮助而且是你喜欢做的", score: { J: 1, P: 0 } }
    ],
    weight: 1
  },
  {
    question: "和一群人在一起，你通常会选",
    options: [
      { label: "跟你很熟悉的个别人谈话", score: { E: 0, I: 1 } },
      { label: "参与大伙的谈话", score: { E: 1, I: 0 } }
    ],
    weight: 1
  },
  {
    question: "在社交聚会上，你会",
    options: [
      { label: "是说话很多的一个", score: { E: 1, I: 0 } },
      { label: "让别人多说话", score: { E: 0, I: 1 } }
    ],
    weight: 1
  },
  {
    question: "把周末期间要完成的事列成清单，这个主意会",
    options: [
      { label: "合你意", score: { J: 1, P: 0 } },
      { label: "使你提不起劲", score: { J: 0, P: 1 } }
    ],
    weight: 1
  },
  {
    question: "哪个是较高的赞誉，或称许为",
    options: [
      { label: "能干的", score: { T: 1, F: 0 } },
      { label: "富有同情心", score: { T: 0, F: 1 } }
    ],
    weight: 1
  },
  {
    question: "你通常喜欢",
    options: [
      { label: "事先安排你的社交约会", score: { J: 1, P: 0 } },
      { label: "随兴之所至做事", score: { J: 0, P: 1 } }
    ],
    weight: 1
  },
  {
    question: "总的说来，要做一个大型作业时，你会选",
    options: [
      { label: "边做边想该做什么", score: { J: 0, P: 1 } },
      { label: "首先把工作按步细分", score: { J: 1, P: 0 } }
    ],
    weight: 1
  },
  {
    question: "你能否滔滔不绝地与人聊天",
    options: [
      { label: "只限于跟你有共同兴趣的人", score: { E: 0, I: 1 } },
      { label: "几乎跟任何人都可以", score: { E: 1, I: 0 } }
    ],
    weight: 1
  },
  {
    question: "你会",
    options: [
      { label: "跟随一些证明有效的方法", score: { S: 1, N: 0 } },
      { label: "分析还有什么毛病，及针对尚未解决的难题", score: { S: 0, N: 1 } }
    ],
    weight: 1
  },
  {
    question: "为乐趣而阅读时，你会",
    options: [
      { label: "喜欢奇特或创新的表达方式", score: { S: 0, N: 1 } },
      { label: "喜欢作者直话直说", score: { S: 1, N: 0 } }
    ],
    weight: 1
  },
  {
    question: "你宁愿替哪一类上司（或者老师）工作？",
    options: [
      { label: "天性淳良，但常常前后不一的", score: { T: 0, F: 1 } },
      { label: "言词尖锐但永远合乎逻辑的", score: { T: 1, F: 0 } }
    ],
    weight: 1
  },
  {
    question: "你做事多数是",
    options: [
      { label: "按当天心情去做", score: { J: 0, P: 1 } },
      { label: "照拟好的程序表去做", score: { J: 1, P: 0 } }
    ],
    weight: 1
  },
  {
    question: "你是否",
    options: [
      { label: "可以和任何人按需求从容地交谈", score: { E: 1, I: 0 } },
      { label: "只是对某些人或在某种情况下才可以畅所欲言", score: { E: 0, I: 1 } }
    ],
    weight: 1
  },
  {
    question: "要作决定时，你认为比较重要的是",
    options: [
      { label: "据事实衡量", score: { T: 1, F: 0 } },
      { label: "考虑他人的感受和意见", score: { T: 0, F: 1 } }
    ],
    weight: 1
  },
  // 第四部分79-93题（词语二选一）
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "想象的", score: { S: 0, N: 1 } },
      { label: "真实的", score: { S: 1, N: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "仁慈慷慨的", score: { T: 0, F: 1 } },
      { label: "意志坚定的", score: { T: 1, F: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "公正的", score: { T: 1, F: 0 } },
      { label: "有关怀心", score: { T: 0, F: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "制作", score: { S: 1, N: 0 } },
      { label: "设计", score: { S: 0, N: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "可能性", score: { S: 0, N: 1 } },
      { label: "必然性", score: { S: 1, N: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "温柔", score: { T: 0, F: 1 } },
      { label: "力量", score: { T: 1, F: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "实际", score: { T: 1, F: 0 } },
      { label: "多愁善感", score: { T: 0, F: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "制造", score: { S: 1, N: 0 } },
      { label: "创造", score: { S: 0, N: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "新颖的", score: { S: 0, N: 1 } },
      { label: "已知的", score: { S: 1, N: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "同情", score: { T: 0, F: 1 } },
      { label: "分析", score: { T: 1, F: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "坚持己见", score: { T: 1, F: 0 } },
      { label: "温柔有爱心", score: { T: 0, F: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "具体的", score: { S: 1, N: 0 } },
      { label: "抽象的", score: { S: 0, N: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "全心投入", score: { T: 0, F: 1 } },
      { label: "有决心的", score: { T: 1, F: 0 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "能干", score: { T: 1, F: 0 } },
      { label: "仁慈", score: { T: 0, F: 1 } }
    ],
    weight: 1
  },
  {
    question: "下列哪一个更合你心意？",
    options: [
      { label: "实际", score: { S: 1, N: 0 } },
      { label: "创新", score: { S: 0, N: 1 } }
    ],
    weight: 1
  }
];

// ========== 组合成最终的questionBank（解决嵌套引用问题） ==========
const questionBank = {
  // 30题版本（E/I8 + S/N8 + T/F7 + J/P7）
  30: [
    ...eiQuestions.slice(0, 8),
    ...snQuestions.slice(0, 8),
    ...tfQuestions.slice(0, 7),
    ...jpQuestions.slice(0, 7)
  ],
  // 50题版本（E/I13 + S/N13 + T/F12 + J/P12）
  50: [
    ...eiQuestions.slice(0, 13),
    ...snQuestions.slice(0, 13),
    ...tfQuestions.slice(0, 12),
    ...jpQuestions.slice(0, 12)
  ],
  //MBTI职业性格测试题
/**
1、参加测试的人员请务必诚实、独立地回答问题，只有如此，才能得到有效的结果。 
2、《性格分析报告》展示的是你的性格倾向，而不是你的知识、技能、经验。 
3、MBTI提供的性格类型描述仅供测试者确定自己的性格类型之用，性格类型没有好坏，只有不同。每一种性格特征都有其价值和优点，也有缺点和需要注意的地方。清楚地了解自己的性格优劣势，有利于更好地发挥自己的特长，而尽可能的在为人处事中避免自己性格中的劣势，更好地和他人相处，更好地作重要的决策。 
4、本测试分为四部分，共93题；需时约18分钟。所有题目没有对错之分，请根据自己的实际情况选择。选择A或者B，请“√”。
只要你是认真、真实地填写了测试问卷，那么通常情况下你都能得到一个确实和你的性格相匹配的类型。希望你能从中或多或少地获得一些有益的信息。
*/
  93:[...mbti93Questions],

  // 100题版本（E/I24 + S/N24 + T/F22 + J/P22）
  100: [
    ...eiQuestions,
    ...snQuestions,
    ...tfQuestions,
    ...jpQuestions
  ]
}

// ========== Fisher-Yates 洗牌算法（题目随机） ==========
function shuffle(arr) {
  let array = [...arr]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}


// ========== 计算属性 ==========
const currentQuestions = computed(() => shuffledQuestions.value)
const currentQuestion = computed(() => {
  if (step.value < 1 || step.value > questionCount.value) return null
  return currentQuestions.value[step.value - 1]
})

// // ========== 计算属性 ==========
// const currentQuestions = computed(() => {
//   return questionBank[questionCount.value] || []
// })

// const currentQuestion = computed(() => {
//   if (step.value < 1 || step.value > questionCount.value) return null
//   return currentQuestions.value[step.value - 1]
// })

const progress = computed(() => {
  if (step.value === 0 || questionCount.value === 0) return 0
  if (step.value > questionCount.value) return 100
  return Math.round((step.value / questionCount.value) * 100)
})

// 加权分数计算（核心题分值更高）
const scores = computed(() => {
  const s = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
  userAnswers.value.forEach((ansIdx, qIdx) => {
    if (ansIdx === -1 || !currentQuestions.value[qIdx]) return
    const q = currentQuestions.value[qIdx]
    const opt = q.options[ansIdx]
    const weight = q.weight || 1 // 权重默认1
    Object.keys(opt.score).forEach(key => {
      s[key] += opt.score[key] * weight // 分数乘以权重
    })
  })
  return s
})

// 倾向度计算
const tendency = computed(() => {
  const s = scores.value
  return {
    EI: s.E + s.I > 0 ? Math.round((Math.max(s.E, s.I) / (s.E + s.I)) * 100) : 50,
    SN: s.S + s.N > 0 ? Math.round((Math.max(s.S, s.N) / (s.S + s.N)) * 100) : 50,
    TF: s.T + s.F > 0 ? Math.round((Math.max(s.T, s.F) / (s.T + s.F)) * 100) : 50,
    JP: s.J + s.P > 0 ? Math.round((Math.max(s.J, s.P) / (s.J + s.P)) * 100) : 50
  }
})

// MBTI结果（含阈值）
const result = computed(() => {
  // 优先使用自评结果，否则用测试结果
  if (selfAssessResult.value) return selfAssessResult.value
  
  const s = scores.value
  let r = ''
  // E/I维度（阈值2分，核心题权重高，结果更稳定）
  r += s.E - s.I > 2 ? 'E' : 'I'
  // S/N维度
  r += s.S - s.N > 2 ? 'S' : 'N'
  // T/F维度
  r += s.T - s.F > 2 ? 'T' : 'F'
  // J/P维度
  r += s.J - s.P > 2 ? 'J' : 'P'
  return r
})

// 结果描述
const resultText = computed(() => {
  const map = {
    ISTJ: "检查员型（ISTJ）：务实、有条理、责任感强，重视传统和秩序。擅长制定计划并严格执行，是团队中可靠的执行者。",
    ISFJ: "守护者型（ISFJ）：温暖、细心、有同情心，重视人际关系和谐。善于照顾他人感受，记忆力出色，是优秀的支持者。",
    INFJ: "咨询师型（INFJ）：富有洞察力、理想主义、有深度。追求意义和价值，善于理解他人内心，有强烈的使命感。",
    INTJ: "建筑师型（INTJ）：逻辑缜密、独立、有远见。擅长战略规划和复杂问题解决，追求完美，是天生的策略家。",
    ISTP: "手艺人型（ISTP）：冷静、务实、灵活。善于动手操作和分析机械原理，适应性强，喜欢探索事物的运作方式。",
    ISFP: "艺术家型（ISFP）：敏感、热情、随性。有出色的审美和创造力，重视个人体验，善于用行动表达情感。",
    INFP: "调停者型（INFP）：理想主义、忠诚、富有创造力。追求内心的和谐，善于共情，有强烈的价值观。",
    INTP: "逻辑学家型（INTP）：理性、好奇、思维敏捷。热衷于探索理论和逻辑，善于发现问题本质，喜欢独立思考。",
    ESTP: "企业家型（ESTP）：精力充沛、大胆、务实。善于把握机会，适应力强，喜欢行动和挑战，是天生的谈判家。",
    ESFP: "表演者型（ESFP）：热情、外向、富有魅力。享受当下，善于表达，有出色的社交能力，喜欢成为焦点。",
    ENFP: "竞选者型（ENFP）：热情、有创造力、乐观。善于发现可能性，富有想象力，社交能力强，喜欢探索新事物。",
    ENTP: "辩论家型（ENTP）：聪明、机智、直言不讳。善于思考和辩论，有出色的逻辑思维，喜欢挑战权威。",
    ESTJ: "总经理型（ESTJ）：果断、高效、有领导力。善于组织和管理，重视结果和效率，有强烈的责任感。",
    ESFJ: "执政官型（ESFJ）：热情、负责、善于社交。重视传统和人际关系，善于组织活动，关心他人，是天生的组织者。",
    ENFJ: "教育家型（ENFJ）：富有魅力、有同情心、热情。善于理解和激励他人，有强烈的使命感，是天生的领导者。",
    ENTJ: "指挥官型（ENTJ）：果断、有领导力、有战略眼光。善于制定目标和战略，有出色的逻辑思维，追求成功。"
  }
  return map[result.value] || "你的性格四个维度倾向较为平衡，值得深入探索！"
})

// ========== 方法 ==========
function startTest() {
  questionCount.value = selectedCount.value
  const rawQuestions = questionBank[questionCount.value]
  shuffledQuestions.value = shuffle(rawQuestions) // 随机题目
  userAnswers.value = new Array(questionCount.value).fill(-1)
  step.value = 1
  select.value = -1
  ElMessage.success(`已开始${questionCount.value}题MBTI测试`)
}

// function choose(i) {
//   if (!currentQuestion.value) return
//   select.value = i
//   userAnswers.value[step.value - 1] = i
// }

// function next() {
//   if (select.value === -1) {
//     ElMessage.warning('请选择一个选项')
//     return
//   }
//   select.value = -1
//   step.value++
// }

function choose(i) {
  if (!currentQuestion.value) return
  select.value = i
  userAnswers.value[step.value - 1] = i
  // 自动下一题：延迟300ms，保留选中视觉反馈
  setTimeout(() => {
    next()
  }, 300)
}

function next() {
  if (select.value === -1) return ElMessage.warning('请选择一个选项')
  select.value = -1
  step.value++
}

function prev() {
  if (step.value > 1) {
    step.value--
    select.value = userAnswers.value[step.value - 1]
  }
}

function resetTest() {
  step.value = 0
  select.value = -1
  questionCount.value = 0
  selectedCount.value = 0
  userAnswers.value = []
   shuffledQuestions.value = []
  selfAssessResult.value = ''
  navActive.value = 'start'
}

function generateSelfAssessResult() {
  let r = ''
  // EI维度：>=50为E，否则I
  r += assessScores.value.EI >= 50 ? 'E' : 'I'
  // SN维度：>=50为S，否则N
  r += assessScores.value.SN >= 50 ? 'S' : 'N'
  // TF维度：>=50为T，否则F
  r += assessScores.value.TF >= 50 ? 'T' : 'F'
  // JP维度：>=50为J，否则P
  r += assessScores.value.JP >= 50 ? 'J' : 'P'
  
  selfAssessResult.value = r
  ElMessage.success(`已生成自评结果：${r}`)
}

// ========== 监听 ==========
watch(step, (newVal) => {
  if (newVal > 0 && newVal <= questionCount.value) {
    select.value = userAnswers.value[newVal - 1]
  }
})

watch(navActive, () => {
  selfAssessResult.value = ''
  select.value = -1
})
</script>

<style scoped>
/* 全局样式 */
.mbti-app {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 顶部导航 */
.header {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 0 20px;
}
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 40px;
  height: 60px;
  align-items: center;
}
.nav-item {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
  padding: 8px 16px;
  border-radius: 6px;
}
.nav-item.active {
  color: #409eff;
  background: #e6f7ff;
}
.nav-item:hover {
  color: #409eff;
}

/* 主内容区 */
.main-content {
  max-width: 1600px;
  margin: 20px auto;
  padding: 20px;
}
.page {
  width: 100%;
}
.card {
  border-radius: 12px;
  padding: 24px;
  background: #fff;
  max-width: 600px;
  margin: 0 auto;
}
.page-title {
  text-align: center;
  color: #303133;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}
.desc {
  text-align: center;
  color: #606266;
  margin-bottom: 20px;
  line-height: 1.6;
}

/* 开始测试页面 */
.count-select {
  text-align: center;
  padding: 20px 0;
}
.count-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}
.count-btn {
  width: 100px;
  height: 40px;
  border-radius: 8px;
  font-size: 16px;
}
.count-btn.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.start-btn {
  margin-top: 10px;
  width: 200px;
}

/* 答题页面 */
.question-page {
  padding: 10px 0;
}
.progress {
  margin-bottom: 20px;
}
.question-title {
  color: #303133;
  font-size: 18px;
  margin-bottom: 15px;
  text-align: center;
}
.question-content {
  color: #606266;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
  padding: 0 10px;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
}
.opt-item {
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fff;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-size: 15px;
  line-height: 1.5;
}
.opt-item.selected {
  background-color: #e6f7ff;
  border-color: #409eff;
  color: #409eff;
}
.opt-item:hover {
  border-color: #c0c4cc;
}
.btns {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
}
.btns button {
  flex: 1;
  height: 40px;
}

/* 结果页面 */
.result-page {
  padding: 10px 0;
}
.result-title {
  text-align: center;
  color: #303133;
  margin-bottom: 20px;
}
.type {
  color: #409eff;
  font-weight: 600;
}
.tendency {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin: 15px 0;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 6px;
}
.tendency-item {
  font-size: 14px;
  color: #606266;
  flex: 1;
  min-width: 100px;
  text-align: center;
}

/* 了解MBTI页面 */
.intro-content {
  line-height: 1.8;
  color: #606266;
}
.intro-desc {
  margin-bottom: 20px;
  text-align: left;
}
.dimensions {
  margin: 20px 0;
}
.dimension-item {
  margin-bottom: 15px;
  padding: 10px;
  background: #f0f9ff;
  border-radius: 6px;
}
.dimension-item h3 {
  color: #409eff;
  font-size: 16px;
  margin-bottom: 8px;
}
.personality-types {
  margin-top: 20px;
}
.personality-types h3 {
  color: #303133;
  font-size: 16px;
  margin-bottom: 10px;
}
.type-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.type-item {
  padding: 6px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
}

/* 自评页面 */
.assess-form {
  margin: 20px;
}
.assess-item {
  margin-bottom: 35px;
}
.assess-item h4 {
  color: #303133;
  font-size: 16px;
  margin-bottom: 10px;
}
.slider {
  width: 100%;
  margin-bottom: 15px;
}
.assess-tip {
  color: #606266;
  font-size: 14px;
  margin: 5px 0 5px 0;
}
.generate-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
  margin-top: 10px;
}
.self-assess-result {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}


.type-icon {
  /* 方式1：固定宽高（适合需要正方形图标） */
  width: 120px;   /* 宽度，单位可选px/rem/vw等 */
  height: auto;  /* 高度，和宽度一致则不变形 */
  
  /* 方式2：只设宽度/高度（自动保持SVG原有比例，推荐） */
  /* width: 100px; */
  /* height: auto; */ /* auto表示根据宽度自动适配高度，避免变形 */
  
  /* 可选：居中对齐、边距等优化 */
  display: block; /* 消除img默认行内间隙 */
  margin: 0 auto; /* 水平居中（按需添加） */
  object-fit: contain; /* 确保SVG完整显示，不裁剪 */
}
/* 响应式适配 */
@media (max-width: 768px) {
  .nav-container {
    gap: 10px;
  }
  .nav-item {
    padding: 6px 10px;
    font-size: 14px;
  }
  .tendency {
    flex-direction: column;
  }
  .type-group {
    flex-direction: column;
  }
}
</style>