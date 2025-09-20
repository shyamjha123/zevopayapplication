import { useState } from "react";
// Payout report state 
export default function useGlobalstatePayoutreport() {

    const [state, setState] = useState({
        currentPicker: null,
        isDatePickerVisible: false,
        startDate: null,
        endDate: null,
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exportModalVisible, setExportModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    return {
        state, setState,
        transactions, setTransactions,
        loading, setLoading,
        exportModalVisible, setExportModalVisible,
        currentPage, setCurrentPage,
        lastPage, setLastPage,
        isFetchingMore, setIsFetchingMore
    };
};



