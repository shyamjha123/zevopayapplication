import { useState } from "react";
// Upi report state
export default function useGlobalstateUpireport() {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [currentPicker, setCurrentPicker] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [exportModalVisible, setExportModalVisible] = useState(false);
    return {
        isDatePickerVisible, setDatePickerVisibility,
        currentPicker, setCurrentPicker,
        startDate, setStartDate,
        endDate, setEndDate,
        transactions, setTransactions,
        currentPage, setCurrentPage,
        lastPage, setLastPage,
        isFetchingMore, setIsFetchingMore,
        loading, setLoading,
        exportModalVisible, setExportModalVisible
    }
};