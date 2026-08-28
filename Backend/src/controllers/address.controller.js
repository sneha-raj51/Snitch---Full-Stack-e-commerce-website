export async function getAddresses(req, res) {
    try {
        const user = req.user;
        return res.status(200).json({ message: "Addresses fetched successfully", success: true, addresses: user.addresses || [] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function addAddress(req, res) {
    try {
        const user = req.user;
        const { fullName, phone, line1, line2, country, state, city, pinCode, addressType } = req.body;

        const address = {
            fullName,
            phone,
            line1,
            line2,
            country,
            state,
            city,
            pinCode,
            addressType
        };

        user.addresses.push(address);
        await user.save();

        const created = user.addresses[user.addresses.length - 1];
        return res.status(201).json({ message: "Address added successfully", success: true, address: created });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function updateAddress(req, res) {
    try {
        const user = req.user;
        const { addressId } = req.params;
        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({ message: "Address not found", success: false });
        }

        const { fullName, phone, line1, line2, country, state, city, pinCode, addressType } = req.body;
        address.fullName = fullName ?? address.fullName;
        address.phone = phone ?? address.phone;
        address.line1 = line1 ?? address.line1;
        address.line2 = line2 ?? address.line2;
        address.country = country ?? address.country;
        address.state = state ?? address.state;
        address.city = city ?? address.city;
        address.pinCode = pinCode ?? address.pinCode;
        address.addressType = addressType ?? address.addressType;

        await user.save();

        return res.status(200).json({ message: "Address updated successfully", success: true, address });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function deleteAddress(req, res) {
    try {
        const user = req.user;
        const { addressId } = req.params;
        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({ message: "Address not found", success: false });
        }

        address.remove();
        await user.save();

        return res.status(200).json({ message: "Address removed successfully", success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}
