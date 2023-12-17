import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

export const labels = [
  {
    value: "new",
    label: "new",
  },
]

export const statuses = [
  {
    value: "ghost",
    label: "Ghost",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "inactive-this-week",
    label: "Inactive",
    icon: StopwatchIcon,
  },
  {
    value: "active-this-week",
    label: "Active",
    icon: CheckCircledIcon,
  },
  {
    value: "left",
    label: "Left",
    icon: CrossCircledIcon,
  },
]

export const priorities = [
  {
    label: "Slowing",
    value: "slowing",
    icon: ArrowDownIcon,
  },
  {
    label: "Steady",
    value: "steady",
    icon: ArrowRightIcon,
  },
  {
    label: "Growing",
    value: "growing",
    icon: ArrowUpIcon,
  },
]
