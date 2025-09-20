import { useState } from "react";
// Virtual account report 
export default function useGlobalstateVirtaulreport() {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [currentPicker, setCurrentPicker] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [userPhone, setUserPhone] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exportModalVisible, setExportModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    return {
        isDatePickerVisible, setDatePickerVisibility,
        currentPicker, setCurrentPicker,
        startDate, setStartDate,
        endDate, setEndDate,
        userPhone, setUserPhone,
        transactions, setTransactions,
        loading, setLoading,
        exportModalVisible, setExportModalVisible,
        currentPage, setCurrentPage,
        lastPage, setLastPage,
        isFetchingMore, setIsFetchingMore
    }
};